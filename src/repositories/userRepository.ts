import { httpClient } from '@/services/httpClient';
import { ENDPOINTS } from '@/constants/endpoints';
import { User, UpdateUserDTO, CreateUserDTO } from '@/models/User';

export const UserRepository = {
  async getAll(): Promise<User[]> {
    const { data } = await httpClient.get<User[]>(ENDPOINTS.users.base);
    return data;
  },

  async getById(id: string): Promise<User> {
    const { data } = await httpClient.get<User>(ENDPOINTS.users.byId(id));
    return data;
  },

  async create(dto: CreateUserDTO): Promise<User> {
    const { data } = await httpClient.post<User>(
      ENDPOINTS.auth.register,
      dto,
    );
    return data;
  },

  async update(id: string, dto: UpdateUserDTO): Promise<User> {
    const { data } = await httpClient.put<User>(
      ENDPOINTS.users.byId(id),
      dto,
    );
    return data;
  },

  async remove(id: string): Promise<void> {
    await httpClient.delete(ENDPOINTS.users.byId(id));
  },
};
