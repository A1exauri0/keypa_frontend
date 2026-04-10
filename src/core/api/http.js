import axios from 'axios';

const TOKEN_KEY = 'keypa_token';
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function crearClienteHttp({ conAuth = true } = {}) {
  const instancia = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });

  if (conAuth) {
    instancia.interceptors.request.use((config) => {
      const token = localStorage.getItem(TOKEN_KEY);

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    });
  }

  return instancia;
}

export const http = crearClienteHttp({ conAuth: true });
export const httpPublic = crearClienteHttp({ conAuth: false });

export { TOKEN_KEY };
