import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { UserRepository } from '@/repositories/userRepository';
import { queryKeys } from '@/hooks/queryClient';
import { UpdateUserDTO, CreateUserDTO } from '@/models/User';

export function useUsersViewModel() {
  const qc = useQueryClient();
  const usersQuery = useQuery({
    queryKey: queryKeys.users,
    queryFn: UserRepository.getAll,
  });

  const createMutation = useMutation({
    mutationFn: (dto: CreateUserDTO) => UserRepository.create(dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.users }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateUserDTO }) =>
      UserRepository.update(id, dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.users }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => UserRepository.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.users }),
  });

  return {
    users: usersQuery.data ?? [],
    isLoading: usersQuery.isLoading,
    isRefreshing: usersQuery.isFetching && !usersQuery.isLoading,
    error: usersQuery.error ? (usersQuery.error as Error).message : null,
    refetch: usersQuery.refetch,

    createUser: createMutation.mutateAsync,
    updateUser: updateMutation.mutateAsync,
    deleteUser: deleteMutation.mutateAsync,

    isMutating:
      createMutation.isPending ||
      updateMutation.isPending ||
      deleteMutation.isPending,
  };
}

export function useUserDetailViewModel(id: string) {
  const query = useQuery({
    queryKey: queryKeys.user(id),
    queryFn: () => UserRepository.getById(id),
    enabled: !!id,
  });

  return {
    user: query.data ?? null,
    isLoading: query.isLoading,
    error: query.error ? (query.error as Error).message : null,
  };
}
