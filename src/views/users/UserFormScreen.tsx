/**
 * views/users/UserFormScreen.tsx
 * Formulario que sirve para CREAR (sin userId) y EDITAR (con userId).
 */
import React, { useEffect, useState } from 'react';
import {
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  View,
} from 'react-native';
import {
  useUsersViewModel,
  useUserDetailViewModel,
} from '@/viewmodels/useUsersViewModel';
import { Button, Field, ErrorBanner, colors } from '@/components/UI';
import { validateUserForm } from '@/utils/validators';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { UsersStackParamList } from '@/navigation/types';

type Props = NativeStackScreenProps<UsersStackParamList, 'UserForm'>;

export default function UserFormScreen({ route, navigation }: Props) {
  const userId = route.params?.userId;
  const isEdit = !!userId;

  const usersVm = useUsersViewModel();
  const detailVm = useUserDetailViewModel(userId ?? '');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Si estamos editando, precargamos los datos al recibirlos.
  useEffect(() => {
    if (isEdit && detailVm.user) {
      setName(detailVm.user.name);
      setEmail(detailVm.user.email);
    }
  }, [isEdit, detailVm.user]);

  const onSubmit = async () => {
    setSubmitError(null);
    const validation = validateUserForm(
      name,
      email,
      isEdit ? undefined : password,
    );
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;

    try {
      if (isEdit) {
        await usersVm.updateUser({ id: userId!, dto: { name, email } });
      } else {
        await usersVm.createUser({ name, email, password });
      }
      Alert.alert('Listo', isEdit ? 'Usuario actualizado' : 'Usuario creado', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (e) {
      setSubmitError((e as Error).message);
    }
  };

  if (isEdit && detailVm.isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.flex} contentContainerStyle={styles.container}>
      <Text style={styles.title}>
        {isEdit ? 'Editar usuario' : 'Nuevo usuario'}
      </Text>

      {!!submitError && <ErrorBanner message={submitError} />}

      <Field
        label="Nombre"
        value={name}
        onChangeText={setName}
        error={errors.name}
      />
      <Field
        label="Correo electrónico"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        error={errors.email}
      />
      {!isEdit && (
        <Field
          label="Contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          error={errors.password}
        />
      )}

      <Button
        title={isEdit ? 'Guardar cambios' : 'Crear usuario'}
        onPress={onSubmit}
        loading={usersVm.isMutating}
      />
      <Button
        title="Cancelar"
        variant="outline"
        onPress={() => navigation.goBack()}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  container: { padding: 20 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: '800', color: colors.text, marginBottom: 20 },
});
