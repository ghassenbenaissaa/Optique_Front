import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

const TOKEN_KEY = 'token';
const REFRESH_TOKEN_KEY = 'refreshToken';
const ROLE_KEY = 'role';
const EXPIRATION_KEY = 'expiration';

const BASE_URL = import.meta.env?.VITE_API_BASE_URL || 'http://localhost:8089/api/v1';

// Instance axios dédiée à l'auth (sans intercepteurs globaux)
const authApi = axios.create({ baseURL: BASE_URL });

export function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY) || null;
  } catch {
    return null;
  }
}

export function clearAuth() {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(ROLE_KEY);
    localStorage.removeItem(EXPIRATION_KEY);
  } catch {}
}

export function decodeToken(token = getToken()) {
  if (!token) return null;
  try {
    const decoded = jwtDecode(token);
    return decoded || null;
  } catch (e) {
    console.error('[authService] Token invalide:', e);
    return null;
  }
}

export function isTokenExpired(token = getToken()) {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return true; // pas de token ou pas d'exp => considérer expiré
  const nowInSeconds = Math.floor(Date.now() / 1000);
  return decoded.exp <= nowInSeconds;
}

export function getUserRole(token = getToken()) {
  const decoded = decodeToken(token);
  let role = null;
  if (decoded) {
    if (decoded.role && typeof decoded.role === 'string') {
      role = decoded.role;
    } else if (Array.isArray(decoded.roles) && decoded.roles.length) {
      role = decoded.roles[0];
    } else if (Array.isArray(decoded.authorities) && decoded.authorities.length) {
      role = decoded.authorities[0];
    }
  }
  if (!role) {
    const stored = localStorage.getItem(ROLE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length) {
          role = parsed[0];
        } else if (typeof parsed === 'string') {
          role = parsed;
        }
      } catch {
        const match = stored.match(/ROLE_[A-Z_]+/);
        role = match ? match[0] : stored;
      }
    }
  }
  return role || null;
}

export function hasRole(allowedRoles = [], token = getToken()) {
  if (!Array.isArray(allowedRoles) || allowedRoles.length === 0) return false;
  const decoded = decodeToken(token) || {};
  const rolesFromToken = [
    decoded.role,
    ...(Array.isArray(decoded.roles) ? decoded.roles : []),
    ...(Array.isArray(decoded.authorities) ? decoded.authorities : []),
  ].filter(Boolean);
  const singleRole = getUserRole(token);
  const allRoles = new Set([singleRole, ...rolesFromToken].filter(Boolean));
  return [...allRoles].some((r) => allowedRoles.includes(r));
}

export function isAuthenticated() {
  const token = getToken();
  if (!token) return false;
  return !isTokenExpired(token);
}

// --- API Calls ---

export async function login(email, password) {
  // Adapter si le backend attend d'autres clés (username, etc.)
  const payload = { email, password };
  const { data } = await authApi.post('/auth/login', payload);
  return data; // { token, refreshToken, expiration, role, issuedAtEpochSeconds, expiresAtEpochSeconds }
}

export async function refreshToken(refreshTokenValue) {
  const payload = { refreshToken: refreshTokenValue };
  const { data } = await authApi.post('/auth/refresh', payload);
  return data; // même structure que login
}

export async function logout() {
  // Option: envoyer le refreshToken pour invalidation côté serveur
  const refreshTokenValue = localStorage.getItem(REFRESH_TOKEN_KEY);
  try {
    await authApi.post('/auth/logout', { refreshToken: refreshTokenValue });
  } catch (e) {
    // Même en cas d'échec, on nettoie côté client
    console.warn('[authService] Échec logout API, on nettoie côté client.');
  }
}
