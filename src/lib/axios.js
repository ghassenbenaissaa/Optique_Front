import axios from 'axios';
import { getToken, clearAuth, refreshToken as apiRefreshToken } from '@/services/authService';

const BASE_URL = import.meta.env?.VITE_API_BASE_URL || 'http://localhost:8089/api/v1';

const api = axios.create({
  baseURL: BASE_URL,
});

let isRefreshing = false;
let pendingRequestsQueue = [];

function attachToken(config) {
  const token = getToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}

api.interceptors.request.use(
  (config) => {
    return attachToken(config);
  },
  (error) => Promise.reject(error)
);

function forceLogoutAndRedirect() {
  try {
    clearAuth();
  } catch {}
  try {
    window.dispatchEvent(new CustomEvent('auth:loggedOut'));
  } catch {}
  const current = `${window.location.pathname}${window.location.search}${window.location.hash}`;
  const loginUrl = `/login?redirectTo=${encodeURIComponent(current)}`;
  if (window.location.pathname !== '/login') {
    window.location.replace(loginUrl);
  }
}

function subscribeTokenRefresh() {
  return new Promise((resolve, reject) => {
    pendingRequestsQueue.push({ resolve, reject });
  });
}

function onRefreshed() {
  pendingRequestsQueue.forEach((p) => p.resolve());
  pendingRequestsQueue = [];
}

function onRefreshFailed(error) {
  pendingRequestsQueue.forEach((p) => p.reject(error));
  pendingRequestsQueue = [];
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (!error.response) {
      console.error('[API] Erreur réseau ou serveur indisponible. Vérifiez votre connexion.');
      return Promise.reject(error);
    }

    const { status, config } = error.response;
    const originalRequest = config;

    const isAuthEndpoint = (originalRequest?.url || '').includes('/auth/');

    if ((status === 401) && !originalRequest._retry && !isAuthEndpoint) {
      originalRequest._retry = true;

      if (isRefreshing) {
        try {
          await subscribeTokenRefresh();
          attachToken(originalRequest);
          return api(originalRequest);
        } catch (e) {
          forceLogoutAndRedirect();
          return Promise.reject(e);
        }
      }

      isRefreshing = true;
      try {
        const refreshTokenValue = localStorage.getItem('refreshToken');
        if (!refreshTokenValue) {
          forceLogoutAndRedirect();
          return Promise.reject(error);
        }

        const data = await apiRefreshToken(refreshTokenValue);
        // Stocker les nouveaux tokens
        if (data?.token) localStorage.setItem('token', data.token);
        if (data?.refreshToken) localStorage.setItem('refreshToken', data.refreshToken);
        if (data?.role) localStorage.setItem('role', data.role);
        if (data?.expiration) localStorage.setItem('expiration', data.expiration);
        try {
          window.dispatchEvent(new CustomEvent('auth:tokenRefreshed', { detail: data }));
        } catch {}

        onRefreshed();

        attachToken(originalRequest);
        return api(originalRequest);
      } catch (e) {
        onRefreshFailed(e);
        forceLogoutAndRedirect();
        return Promise.reject(e);
      } finally {
        isRefreshing = false;
      }
    }

    if (status === 401) {
      forceLogoutAndRedirect();
    } else if (status === 403) {
      // 403 interdit: ne pas rediriger automatiquement; laisser le composant gérer.
      console.warn('[API] 403 Forbidden sur', originalRequest?.url);
    }

    if (status >= 500) {
      console.error(`[API] Erreur serveur (${status}).`);
    }

    return Promise.reject(error);
  }
);

export function logout() {
  forceLogoutAndRedirect();
}

api.__refreshAccessToken = apiRefreshToken;

export default api;
