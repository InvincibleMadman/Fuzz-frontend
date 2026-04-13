import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { Dispatch, ReactNode, SetStateAction } from 'react';
import { api } from '../lib/api';
import { readBaseUrl, readSession, writeBaseUrl, writeSession } from '../lib/storage';
import type { CoverageHistoryPayload, FuzzStatsPayload, SessionState, ToastState } from '../types';

type AppContextValue = {
  baseUrl: string;
  setBaseUrl: (value: string) => void;
  toast: ToastState;
  notifySuccess: (message: string) => void;
  notifyError: (error: unknown) => void;
  session: SessionState;
  setSession: Dispatch<SetStateAction<SessionState>>;
  stats: FuzzStatsPayload | null;
  history: CoverageHistoryPayload | null;
  statsLoading: boolean;
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [baseUrl, setBaseUrlState] = useState(readBaseUrl());
  const [toast, setToast] = useState<ToastState>(null);
  const [session, setSession] = useState<SessionState>(readSession);
  const [stats, setStats] = useState<FuzzStatsPayload | null>(null);
  const [history, setHistory] = useState<CoverageHistoryPayload | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);

  useEffect(() => {
    writeBaseUrl(baseUrl);
  }, [baseUrl]);

  useEffect(() => {
    writeSession(session);
  }, [session]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 2600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    if (!session.outputPath) {
      setStats(null);
      setHistory(null);
      return;
    }

    let active = true;
    const poll = async () => {
      try {
        setStatsLoading(true);
        const [statsResp, historyResp] = await Promise.all([
          api.getFuzzStats(session.outputPath),
          api.getCoverageHistory(session.outputPath),
        ]);
        if (!active) return;
        setStats(statsResp.data);
        setHistory(historyResp.data);
      } catch (error) {
        if (active) notifyError(error);
      } finally {
        if (active) setStatsLoading(false);
      }
    };

    poll();
    const timer = window.setInterval(poll, 5000);
    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, [session.outputPath]);

  function notifySuccess(message: string) {
    setToast({ type: 'success', message });
  }

  function notifyError(error: unknown) {
    const message = error instanceof Error ? error.message : '发生未知错误';
    setToast({ type: 'error', message });
  }

  const value = useMemo<AppContextValue>(
    () => ({
      baseUrl,
      setBaseUrl: setBaseUrlState,
      toast,
      notifySuccess,
      notifyError,
      session,
      setSession,
      stats,
      history,
      statsLoading,
    }),
    [baseUrl, toast, session, stats, history, statsLoading],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
}
