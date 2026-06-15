// src/viewmodels/useNotificationViewModel.ts
// ViewModel (patrón MVVM): mantiene el estado del formulario y la lógica de envío,
// dejando la pantalla (View) libre de lógica de negocio/red.

import { sendNotification } from '@/services/NotificationService';
import { useState, useCallback } from 'react';

type Status = 'idle' | 'loading' | 'success' | 'error';

const EMAIL_REGEX = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export function useNotificationViewModel() {
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const [status, setStatus] = useState<Status>('idle');
  const [feedback, setFeedback] = useState<string>('');

  const validate = useCallback((): string | null => {
    if (!email.trim()) return 'El correo destino es obligatorio.';
    if (!EMAIL_REGEX.test(email.trim())) return 'El formato del correo no es válido.';
    if (!subject.trim()) return 'El asunto es obligatorio.';
    if (!message.trim()) return 'El mensaje es obligatorio.';
    return null;
  }, [email, subject, message]);

  const reset = useCallback(() => {
    setEmail('');
    setSubject('');
    setMessage('');
    setStatus('idle');
    setFeedback('');
  }, []);

  const submit = useCallback(async () => {
    const validationError = validate();
    if (validationError) {
      setStatus('error');
      setFeedback(validationError);
      return;
    }

    setStatus('loading');
    setFeedback('');

    try {
      const result = await sendNotification({
        email: email.trim(),
        subject: subject.trim(),
        message: message.trim(),
      });
      setStatus('success');
      setFeedback(result.message); // "Mensaje enviado correctamente."
    } catch (err: any) {
      setStatus('error');
      setFeedback('Error al enviar mensaje.');
      // Detalle opcional para depuración:
      // setFeedback(`Error al enviar mensaje. ${err?.message ?? ''}`);
    }
  }, [email, subject, message, validate]);

  return {
    // estado del formulario
    email,
    subject,
    message,
    setEmail,
    setSubject,
    setMessage,
    // estado de la operación
    status,
    feedback,
    isLoading: status === 'loading',
    // acciones
    submit,
    reset,
  };
}
