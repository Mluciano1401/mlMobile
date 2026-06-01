import { httpClient } from '@/services/httpClient';
import { ENDPOINTS } from '@/constants/endpoints';
import { LoginDTO, CreateUserDTO, User } from '@/models/User';
import { LoginResponse } from '@/models/Auth';

export const AuthRepository = {
  async login(credentials: LoginDTO): Promise<LoginResponse> {
    const { data } = await httpClient.post<LoginResponse>(
      ENDPOINTS.auth.login,
      credentials,
    );
    return data;
  },

  async register(dto: CreateUserDTO): Promise<User> {
    const { data } = await httpClient.post<User>(
      ENDPOINTS.auth.register,
      dto,
    );
    return data;
  },
};
