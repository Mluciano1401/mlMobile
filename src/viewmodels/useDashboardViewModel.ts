import { useQueries } from '@tanstack/react-query';
import { UserRepository } from '@/repositories/userRepository';
import { queryKeys } from '@/hooks/queryClient';
import { User } from '@/models/User';

export interface QueryStatus {
  label: string;
  loaded: boolean;
  error: string | null;
}

export interface DashboardData {
  users: User[];
  totalUsers: number;
  latestUser: User | null;
}

export interface DashboardViewModel {
  data: DashboardData | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
  queryStatuses: QueryStatus[];
}

export function useDashboardViewModel(): DashboardViewModel {

  const [usersResult, profileResult, settingsResult] = useQueries({
    queries: [
      {
        queryKey: queryKeys.users,
        queryFn: UserRepository.getAll,
      },
      {
        queryKey: [...queryKeys.users, 'profile'],
        queryFn: UserRepository.getAll,
      },
      {
        queryKey: [...queryKeys.users, 'settings'],
        queryFn: UserRepository.getAll,
      },
    ],
  });

  const isLoading =
    usersResult.isLoading || profileResult.isLoading || settingsResult.isLoading;

  const rawError =
    usersResult.error ?? profileResult.error ?? settingsResult.error;

  const users = usersResult.data ?? [];

  return {
    data: !isLoading
      ? {
          users,
          totalUsers: users.length,
          latestUser: users.length > 0 ? users[users.length - 1] : null,
        }
      : null,
    isLoading,
    error: rawError ? (rawError as Error).message : null,
    refetch: usersResult.refetch,
    queryStatuses: [
      {
        label: 'GET /users',
        loaded: !usersResult.isLoading,
        error: usersResult.error ? (usersResult.error as Error).message : null,
      },
      {
        label: 'GET /profile  (sim.)',
        loaded: !profileResult.isLoading,
        error: profileResult.error
          ? (profileResult.error as Error).message
          : null,
      },
      {
        label: 'GET /settings (sim.)',
        loaded: !settingsResult.isLoading,
        error: settingsResult.error
          ? (settingsResult.error as Error).message
          : null,
      },
    ],
  };
}
