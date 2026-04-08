import { http } from '../../../core/api/http';

export async function loginUsuario(payload) {
  const { data } = await http.post('/auth/login', payload);
  return data;
}

export async function meUsuario() {
  const { data } = await http.get('/auth/me');
  return data;
}

export async function logoutUsuario() {
  const { data } = await http.post('/auth/logout');
  return data;
}
