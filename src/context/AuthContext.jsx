import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { clearAuth as clearAuthStore, isTokenExpired, login as apiLogin, logout as apiLogout, refreshToken as apiRefreshToken } from '@/services/authService';

const TOKEN_KEY = 'token';
const REFRESH_TOKEN_KEY = 'refreshToken';
const ROLE_KEY = 'role';
const EXPIRATION_KEY = 'expiration';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [refreshToken, setRefreshToken] = useState(() => localStorage.getItem(REFRESH_TOKEN_KEY));
  const [role, setRole] = useState(() => localStorage.getItem(ROLE_KEY));
  const [expiration, setExpiration] = useState(() => localStorage.getItem(EXPIRATION_KEY));
  const logoutTimerRef = useRef(null);

  const isAuthenticated = !!token && !isTokenExpired(token);

  const scheduleAutoLogout = useCallback(() => {
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
      logoutTimerRef.current = null;
    }
    if (!token) return;
    try {
      const now = Math.floor(Date.now() / 1000);
      const decoded = JSON.parse(atob(token.split('.')[1] || 'null')) || {};
      const exp = decoded.exp || 0;
      const ms = Math.max(0, (exp - now) * 1000);
      if (ms > 0) {
        logoutTimerRef.current = setTimeout(() => {
          handleLogout();
        }, ms);
      }
    } catch {}
  }, [token]);

  useEffect(() => {
    scheduleAutoLogout();
    return () => {
      if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
    };
  }, [scheduleAutoLogout]);

  // Synchronisation avec l’intercepteur Axios
  useEffect(() => {
    const onRefreshed = (e) => {
      const data = e?.detail;
      if (!data) return;
      // Persist et mettre à jour l’état local
      if (data.token) {
        localStorage.setItem(TOKEN_KEY, data.token);
        setToken(data.token);
      }
      if (data.refreshToken) {
        localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
        setRefreshToken(data.refreshToken);
      }
      if (data.role) {
        localStorage.setItem(ROLE_KEY, data.role);
        setRole(data.role);
      }
      if (data.expiration) {
        localStorage.setItem(EXPIRATION_KEY, data.expiration);
        setExpiration(data.expiration);
      }
    };
    const onLoggedOut = () => {
      setToken(null);
      setRefreshToken(null);
      setRole(null);
      setExpiration(null);
    };

    window.addEventListener('auth:tokenRefreshed', onRefreshed);
    window.addEventListener('auth:loggedOut', onLoggedOut);
    return () => {
      window.removeEventListener('auth:tokenRefreshed', onRefreshed);
      window.removeEventListener('auth:loggedOut', onLoggedOut);
    };
  }, []);

  const persistAuth = useCallback((data) => {
    if (!data) return;
    const { token: t, refreshToken: rt, role: r, expiration: exp } = data;
    if (t) {
      localStorage.setItem(TOKEN_KEY, t);
      setToken(t);
    }
    if (rt) {
      localStorage.setItem(REFRESH_TOKEN_KEY, rt);
      setRefreshToken(rt);
    }
    if (r) {
      localStorage.setItem(ROLE_KEY, r);
      setRole(r);
    }
    if (exp) {
      localStorage.setItem(EXPIRATION_KEY, exp);
      setExpiration(exp);
    }
  }, []);

  const handleLogin = useCallback(async (email, password) => {
    const data = await apiLogin(email, password);
    persistAuth(data);
    return data;
  }, [persistAuth]);

  const handleRefresh = useCallback(async () => {
    const rt = localStorage.getItem(REFRESH_TOKEN_KEY);
    if (!rt) throw new Error('No refresh token');
    const data = await apiRefreshToken(rt);
    persistAuth(data);
    return data;
  }, [persistAuth]);

  const handleLogout = useCallback(async (redirectPath = '/login') => {
    try {
      await apiLogout();
    } finally {
      clearAuthStore();
      setToken(null);
      setRefreshToken(null);
      setRole(null);
      setExpiration(null);
      navigate(redirectPath, { replace: true });
    }
  }, [navigate]);

  const value = useMemo(() => ({
    token,
    refreshToken,
    role,
    expiration,
    isAuthenticated,
    login: handleLogin,
    logout: handleLogout,
    refresh: handleRefresh,
  }), [token, refreshToken, role, expiration, isAuthenticated, handleLogin, handleLogout, handleRefresh]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
