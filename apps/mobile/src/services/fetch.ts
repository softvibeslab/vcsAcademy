import AsyncStorage from '@react-native-async-storage/async-storage';

import { API_ROOT } from '../config/api';

type ApiFetchOptions = RequestInit & {
  authenticated?: boolean;
};

export async function apiFetch<T>(
  path: string,
  options: ApiFetchOptions = {}
): Promise<T> {
  const { authenticated = true, headers, body, ...rest } = options;
  const requestHeaders = new Headers(headers);

  if (body && !(body instanceof FormData) && !requestHeaders.has('Content-Type')) {
    requestHeaders.set('Content-Type', 'application/json');
  }

  if (authenticated) {
    const token = await AsyncStorage.getItem('auth_token');
    if (token) {
      requestHeaders.set('Authorization', `Bearer ${token}`);
    }
  }

  const response = await fetch(`${API_ROOT}${path}`, {
    ...rest,
    body,
    headers: requestHeaders,
  });

  if (!response.ok) {
    let errorMessage = `Request failed with status ${response.status}`;

    try {
      const errorPayload = await response.json();
      errorMessage =
        errorPayload.detail ||
        errorPayload.message ||
        errorPayload.error ||
        errorMessage;
    } catch {
      // Keep the fallback message when there is no JSON payload.
    }

    throw new Error(errorMessage);
  }

  if (response.status === 204) {
    return null as T;
  }

  return response.json() as Promise<T>;
}
