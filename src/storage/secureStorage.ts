import * as Keychain from 'react-native-keychain';

const TOKEN_SERVICE = 'go-hexagonal-mobile.token';

export const SecureStorage = {
  async saveToken(token: string): Promise<void> {
    await Keychain.setGenericPassword('jwt', token, { service: TOKEN_SERVICE });
  },

  async getToken(): Promise<string | null> {
    const creds = await Keychain.getGenericPassword({ service: TOKEN_SERVICE });
    return creds ? creds.password : null;
  },

  async clearToken(): Promise<void> {
    await Keychain.resetGenericPassword({ service: TOKEN_SERVICE });
  },
};
