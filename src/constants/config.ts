import { Platform } from 'react-native';

const DEV_HOST = Platform.select({
  android: 'http://10.0.2.2:8080',
  ios: 'http://localhost:8080',
  default: 'http://localhost:8080',
});

export const API_BASE_URL = `${DEV_HOST}/api/v1`;

export const FILE_HOST = DEV_HOST;

export const REQUEST_TIMEOUT = 15000;

export const MAX_FILE_SIZE = 5 * 1024 * 1024;
