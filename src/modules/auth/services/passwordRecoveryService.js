import { httpPublic } from '../../../core/api/http';

export async function solicitarRecuperacionPassword(payload) {
  const { data } = await httpPublic.post('/auth/forgot-password', payload);
  return data;
}

export async function restablecerPassword(payload) {
  const { data } = await httpPublic.post('/auth/reset-password', payload);
  return data;
}
