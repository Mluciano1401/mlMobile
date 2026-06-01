/**
 * views/users/UsersListScreen.tsx
 * Lista de usuarios con pull-to-refresh, eliminar y navegación a editar/crear.
 */
import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useUsersViewModel } from '@/viewmodels/useUsersViewModel';
import { Button, ErrorBanner, colors } from '@/components/UI';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { UsersStackParamList } from '@/navigation/types';
import { User } from '@/models/User';

type Props = NativeStackScreenProps<UsersStackParamList, 'UsersList'>;

export default function UsersListScreen({ navigation }: Props) {
  const vm = useUsersViewModel();

  const confirmDelete = (user: User) => {
    Alert.alert('Eliminar', `¿Eliminar a ${user.name}?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: () => vm.deleteUser(user.id),
      },
    ]);
  };

  const renderItem = ({ item }: { item: User }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('UserForm', { userId: item.id })}>
      <View style={styles.flex}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.email}>{item.email}</Text>
      </View>
      <TouchableOpacity onPress={() => confirmDelete(item)} hitSlop={10}>
        <Text style={styles.delete}>Eliminar</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  if (vm.isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {!!vm.error && <ErrorBanner message={vm.error} />}

      <FlatList
        data={vm.users}
        keyExtractor={u => u.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.empty}>No hay usuarios todavía.</Text>
        }
        refreshControl={
          <RefreshControl
            refreshing={vm.isRefreshing}
            onRefresh={vm.refetch}
            colors={[colors.primary]}
          />
        }
      />

      <View style={styles.footer}>
        <Button
          title="+ Nuevo usuario"
          onPress={() => navigation.navigate('UserForm', {})}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  list: { padding: 16 },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  flex: { flex: 1 },
  name: { fontSize: 16, fontWeight: '700', color: colors.text },
  email: { fontSize: 14, color: colors.muted, marginTop: 2 },
  delete: { color: colors.danger, fontWeight: '600' },
  empty: { textAlign: 'center', color: colors.muted, marginTop: 40 },
  footer: { padding: 16 },
});
