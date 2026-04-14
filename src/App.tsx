import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { Sidebar } from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar';
import { Toast } from './components/Toast';
import { AppProvider, useAppContext } from './context/AppContext';
import { FuzzPage } from './pages/FuzzPage';
import { OverviewPage } from './pages/OverviewPage';
import { ProtocolPage } from './pages/ProtocolPage';
import { RiskPage } from './pages/RiskPage';
import { SeedPage } from './pages/SeedPage';
import { SystemConfigPage } from './pages/SystemConfigPage';

const pageMotion = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 },
  transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] },
};

function AppLayout() {
  const location = useLocation();
  const { baseUrl, setBaseUrl, session, stats, statsLoading, toast } = useAppContext();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className={`app-shell ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <Sidebar
        baseUrl={baseUrl}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((value) => !value)}
        pid={session.pid}
        coverage={stats?.branchCoverage ?? null}
        isPolling={statsLoading}
      />

      <section className="content-shell">
        <Topbar baseUrl={baseUrl} onChangeBaseUrl={setBaseUrl} pid={session.pid} />

        <main className="workspace">
          <AnimatePresence mode="wait">
            <motion.div key={location.pathname} {...pageMotion} style={{ height: '100%' }}>
              <Routes>
                <Route path="/" element={<OverviewPage />} />
                <Route path="/protocol" element={<ProtocolPage />} />
                <Route path="/seed" element={<SeedPage />} />
                <Route path="/risk" element={<RiskPage />} />
                <Route path="/fuzz" element={<FuzzPage />} />
                <Route path="/settings" element={<SystemConfigPage />} />
              </Routes>
            </motion.div>
          </AnimatePresence>
        </main>
      </section>

      <Toast toast={toast} />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppLayout />
    </AppProvider>
  );
}