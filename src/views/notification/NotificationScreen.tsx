// src/screens/NotificationScreen.tsx
// View (MVVM): solo presentación + binding al ViewModel.

import { useNotificationViewModel } from '@/viewmodels/useNotificationViewModel';
import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';

export default function NotificationScreen() {
  const vm = useNotificationViewModel();

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Enviar notificación</Text>
        <Text style={styles.subtitle}>
          El mensaje viaja: App → Backend → SNS → SQS → Lambda → Correo
        </Text>

        <Text style={styles.label}>Correo destino</Text>
        <TextInput
          style={styles.input}
          placeholder="usuario@correo.com"
          autoCapitalize="none"
          keyboardType="email-address"
          value={vm.email}
          onChangeText={vm.setEmail}
          editable={!vm.isLoading}
        />

        <Text style={styles.label}>Asunto</Text>
        <TextInput
          style={styles.input}
          placeholder="Prueba SNS"
          value={vm.subject}
          onChangeText={vm.setSubject}
          editable={!vm.isLoading}
        />

        <Text style={styles.label}>Mensaje</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Hola desde AWS Serverless"
          multiline
          numberOfLines={5}
          textAlignVertical="top"
          value={vm.message}
          onChangeText={vm.setMessage}
          editable={!vm.isLoading}
        />

        <TouchableOpacity
          style={[styles.button, vm.isLoading && styles.buttonDisabled]}
          onPress={vm.submit}
          disabled={vm.isLoading}>
          {vm.isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Enviar</Text>
          )}
        </TouchableOpacity>

        {vm.status === 'success' && (
          <Text style={[styles.feedback, styles.success]}>{vm.feedback}</Text>
        )}
        {vm.status === 'error' && (
          <Text style={[styles.feedback, styles.error]}>{vm.feedback}</Text>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: '#0f172a' },
  container: { padding: 20 },
  title: { fontSize: 24, fontWeight: '700', color: '#f8fafc', marginBottom: 4 },
  subtitle: { fontSize: 12, color: '#94a3b8', marginBottom: 24 },
  label: { fontSize: 14, color: '#cbd5e1', marginBottom: 6, marginTop: 12 },
  input: {
    backgroundColor: '#1e293b',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#f8fafc',
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#334155',
  },
  textArea: { height: 120 },
  button: {
    backgroundColor: '#3b82f6',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonDisabled: { backgroundColor: '#1d4ed8', opacity: 0.7 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  feedback: { marginTop: 18, fontSize: 15, textAlign: 'center', fontWeight: '600' },
  success: { color: '#22c55e' },
  error: { color: '#ef4444' },
});
