import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { AuthUser, UserRole } from '../types/forensic';

// ─── Demo Accounts ────────────────────────────────────────────────────────────
const DEMO_ACCOUNTS: Record<string, { password: string; user: AuthUser }> = {
  admin: {
    password: 'admin123',
    user: {
      username: 'admin',
      displayName: 'Supt. A. Kumar',
      role: 'admin',
      department: 'Cyber Crime HQ',
    },
  },
  investigator: {
    password: 'investigator123',
    user: {
      username: 'investigator',
      displayName: 'Insp. R. S. Gill',
      role: 'investigator',
      department: 'Cyber Crime Cell',
    },
  },
  analyst: {
    password: 'analyst123',
    user: {
      username: 'analyst',
      displayName: 'K. Mehta',
      role: 'analyst',
      department: 'Digital Forensics',
    },
  },
};

// ─── Role Permissions ─────────────────────────────────────────────────────────
export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  admin: [
    'view_all_cases', 'upload_evidence', 'delete_evidence',
    'manage_users', 'view_audit_log', 'generate_reports',
    'access_copilot', 'view_security_center', 'access_settings',
    'view_graph', 'view_timeline', 'view_finance', 'view_map',
    'view_correlation', 'view_social', 'view_entity_dna',
  ],
  investigator: [
    'view_assigned_cases', 'upload_evidence', 'view_graph',
    'view_timeline', 'view_finance', 'view_social', 'access_copilot',
    'generate_reports', 'view_audit_log', 'view_correlation',
    'view_entity_dna', 'view_map',
  ],
  analyst: [
    'view_evidence', 'view_graph', 'view_map', 'view_timeline',
    'view_correlation', 'view_entity_dna', 'view_finance',
    'access_copilot', 'view_social',
  ],
};

// ─── Context Types ─────────────────────────────────────────────────────────────
interface AuthSession {
  user: AuthUser;
  loginTime: number;  // Unix ms
  sessionIp: string;
}

interface AuthContextValue {
  session: AuthSession | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  hasPermission: (perm: string) => boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const SESSION_KEY = 'nexus_session';

const MOCK_IPS = ['10.240.12.88', '10.241.0.14', '10.240.55.3'];
const randomIp = () => MOCK_IPS[Math.floor(Math.random() * MOCK_IPS.length)];

// ─── Provider ─────────────────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(() => {
    try {
      const stored = localStorage.getItem(SESSION_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // Persist session changes to localStorage
  useEffect(() => {
    if (session) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    } else {
      localStorage.removeItem(SESSION_KEY);
    }
  }, [session]);

  const login = useCallback((username: string, password: string): boolean => {
    const account = DEMO_ACCOUNTS[username.toLowerCase()];
    if (!account || account.password !== password) return false;

    setSession({
      user: account.user,
      loginTime: Date.now(),
      sessionIp: randomIp(),
    });
    return true;
  }, []);

  const logout = useCallback(() => {
    setSession(null);
  }, []);

  const hasPermission = useCallback((perm: string): boolean => {
    if (!session) return false;
    return ROLE_PERMISSIONS[session.user.role].includes(perm);
  }, [session]);

  return (
    <AuthContext.Provider value={{
      session,
      login,
      logout,
      hasPermission,
      isAuthenticated: session !== null,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ──────────────────────────────────────────────────────────────────────
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
