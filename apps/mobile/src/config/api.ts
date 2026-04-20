import Constants, { ExecutionEnvironment } from 'expo-constants';

const localFallbackApiRoot = 'http://localhost:8001/api';
const expoGoFallbackApiRoot = 'https://api.salesmastersminds.com/api';

const isExpoGo =
  Constants.executionEnvironment === ExecutionEnvironment.StoreClient ||
  Constants.appOwnership === 'expo';

const fallbackApiRoot = isExpoGo ? expoGoFallbackApiRoot : localFallbackApiRoot;

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
