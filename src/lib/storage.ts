import { DEFAULT_BASE_URL, STORAGE_KEY_BASE_URL, STORAGE_KEY_SESSION } from './constants';
import type { SessionState } from '../types';

export function readBaseUrl() {
  return localStorage.getItem(STORAGE_KEY_BASE_URL) || DEFAULT_BASE_URL;
}

export function writeBaseUrl(url: string) {
  localStorage.setItem(STORAGE_KEY_BASE_URL, url.replace(/\/$/, ''));
}

export function readSession(): SessionState {
  const raw = localStorage.getItem(STORAGE_KEY_SESSION);
  if (!raw) {
    return { pid: null, outputPath: '', dbPath: '', statsFilePath: '' };
  }
  try {
    return JSON.parse(raw) as SessionState;
  } catch {
    return { pid: null, outputPath: '', dbPath: '', statsFilePath: '' };
  }
}

export function writeSession(session: SessionState) {
  localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(session));
}
