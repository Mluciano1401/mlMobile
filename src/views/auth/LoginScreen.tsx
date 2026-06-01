import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useAuthViewModel } from '@/viewmodels/useAuthViewModel';
import { Button, Field, ErrorBanner, colors } from '@/components/UI';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '@/navigation/types';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const vm = useAuthViewModel();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onLogin = async () => {
    await vm.login(email, password);
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Iniciar sesión</Text>
        <Text style={styles.subtitle}>Go Hexagonal Mobile</Text>

        {!!vm.error && <ErrorBanner message={vm.error} />}

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
          placeholder="••••••••"
          error={vm.fieldErrors.password}
        />

        <Button title="Entrar" onPress={onLogin} loading={vm.isLoading} />

        <TouchableOpacity
          onPress={() => navigation.navigate('Register')}
          style={styles.link}>
          <Text style={styles.linkText}>
            ¿No tienes cuenta? <Text style={styles.bold}>Regístrate</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  container: { padding: 24, flexGrow: 1, justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: '800', color: colors.text },
  subtitle: { fontSize: 15, color: colors.muted, marginBottom: 28 },
  link: { marginTop: 18, alignItems: 'center' },
  linkText: { color: colors.muted, fontSize: 15 },
  bold: { color: colors.primary, fontWeight: '700' },
});
