import React, { useState } from 'react';
import {
  Text,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useAuthViewModel } from '@/viewmodels/useAuthViewModel';
import { Button, Field, ErrorBanner, colors } from '@/components/UI';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '@/navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

export default function RegisterScreen({ navigation }: Props) {
  const vm = useAuthViewModel();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onRegister = async () => {
    const ok = await vm.register({ name, email, password });
    if (ok) {
      Alert.alert('Listo', 'Cuenta creada. Ahora inicia sesión.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Crear cuenta</Text>

        {!!vm.error && <ErrorBanner message={vm.error} />}

        <Field
          label="Nombre"
          value={name}
          onChangeText={setName}
          placeholder="Tu nombre"
          error={vm.fieldErrors.name}
        />
        <Field
          label="Correo electrónico"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholder="tucorreo@ejemplo.com"
          error={vm.fieldErrors.email}
        />
        <Field
          label="Contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="Mínimo 6 caracteres"
          error={vm.fieldErrors.password}
        />

        <Button title="Registrarme" onPress={onRegister} loading={vm.isLoading} />
        <Button
          title="Volver"
          variant="outline"
          onPress={() => navigation.goBack()}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  container: { padding: 24, flexGrow: 1, justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: '800', color: colors.text, marginBottom: 24 },
});
