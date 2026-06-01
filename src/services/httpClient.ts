import axios, { AxiosError, AxiosInstance } from 'axios';
import { API_BASE_URL, REQUEST_TIMEOUT } from '@/constants/config';
import { SecureStorage } from '@/storage/secureStorage';
import { ApiError } from '@/models/Auth';

let onUnauthorized: (() => void) | null = null;
export function setUnauthorizedHandler(handler: () => void) {
  onUnauthorized = handler;
}

export const httpClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: REQUEST_TIMEOUT,
  headers: { 'Content-Type': 'application/json' },
});

httpClient.interceptors.request.use(async config => {
  const token = await SecureStorage.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

httpClient.interceptors.response.use(
  response => response,
  (error: AxiosError<ApiError>) => {
    if (error.response?.status === 401 && onUnauthorized) {
      onUnauthorized();
    }

    const message =
      error.response?.data?.error ||
      error.message ||
      'Error de conexión con el servidor';

    return Promise.reject(new Error(message));
  },
);
