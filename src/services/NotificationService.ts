// src/services/NotificationService.ts
// Capa de acceso a datos: consume el endpoint POST /notifications/send del backend.

import { API_BASE_URL } from "@/constants/config";

// AJUSTA esta URL al base URL real de tu API Gateway.
// Idealmente impórtala de tu config existente (ej: import { API_BASE_URL } from '../config').

export interface SendNotificationRequest {
  email: string;
  subject: string;
  message: string;
}

export interface SendNotificationResult {
  ok: boolean;
  message: string;
}

/**
 * Publica una solicitud de notificación en el backend, que a su vez la publica en SNS.
 * Lanza error si la respuesta HTTP no es 2xx.
 */
export async function sendNotification(
  req: SendNotificationRequest,
): Promise<SendNotificationResult> {
  // Cambia '/api/v1/notifications/send' por '/notifications/send' si tu API no usa prefijo.
  const url = `${API_BASE_URL}/api/v1/notifications/send`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // Si tu API requiere JWT, agrega: Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(req),
  });

  let payload: any = null;
  try {
    payload = await response.json();
  } catch {
    // respuesta sin cuerpo JSON
  }

  if (!response.ok) {
    const detail = payload?.error ?? `HTTP ${response.status}`;
    throw new Error(detail);
  }

  return {
    ok: true,
    message: payload?.message ?? 'Mensaje enviado correctamente.',
  };
}
