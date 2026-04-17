const fallbackApiRoot = 'http://localhost:8001/api';

const configuredApiRoot =
  process.env.EXPO_PUBLIC_API_URL?.trim() ||
  process.env.REACT_APP_API_URL?.trim() ||
  fallbackApiRoot;

export const API_ROOT = configuredApiRoot.replace(/\/$/, '');

export const API_ENDPOINTS = {
  root: API_ROOT,
  auth: `${API_ROOT}/auth`,
  mobile: `${API_ROOT}/mobile`,
};
