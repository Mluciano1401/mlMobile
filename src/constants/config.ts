import { Platform } from 'react-native';
const PROD_URL = 'https://zjwz1ykrp1.execute-api.us-east-1.amazonaws.com';

const DEV_HOST = Platform.select({
  android: 'http://10.117.44.180:8082',
  ios: 'http://localhost:8082',
  default: 'http://localhost:8082',
});

const BASE = 'http://127.0.0.1:61443';

export const API_BASE_URL   = `${BASE}/api/v1`;
export const FILE_HOST      = BASE;

export const REQUEST_TIMEOUT = 15000;

export const MAX_FILE_SIZE = 5 * 1024 * 1024;
