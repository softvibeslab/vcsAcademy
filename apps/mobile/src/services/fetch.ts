import AsyncStorage from '@react-native-async-storage/async-storage';

import { API_ROOT } from '../config/api';
import { getDemoApiResponse } from '../demo/api';

type ApiFetchOptions = RequestInit & {
  authenticated?: boolean;
};

export async function apiFetch<T>(
  path: string,
  options: ApiFetchOptions = {}
): Promise<T> {
  const { authenticated = true, headers, body, ...rest } = options;
  const requestHeaders = new Headers(headers);
  const token = await AsyncStorage.getItem('auth_token');

  if (body && !(body instanceof FormData) && !requestHeaders.has('Content-Type')) {
    requestHeaders.set('Content-Type', 'application/json');
  }

  if (authenticated) {
    if (token) {
      requestHeaders.set('Authorization', `Bearer ${token}`);
    }
  }

  const demoResponse = await getDemoApiResponse<T>(path, { ...rest, authenticated, body }, token);
  if (demoResponse !== null) {
    return demoResponse;
  }

  let response: Response;

  try {
    response = await fetch(`${API_ROOT}${path}`, {
      ...rest,
      body,
      headers: requestHeaders,
    });
  } catch (error) {
    if (error instanceof Error && /network request failed/i.test(error.message)) {
      throw new Error('Network request failed. Use demo@vcsa.com / demo123 to continue in demo mode.');
    }

    throw error;
  }

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
