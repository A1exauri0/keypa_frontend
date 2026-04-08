# Keypa Frontend

Aplicacion cliente para autenticacion y panel inicial de usuarios, construida con React + Vite + Tailwind CSS.

## Contexto del repositorio

- Stack: React 19, React Router, Axios, Context API, Tailwind CSS.
- Objetivo actual: login, sesion persistente por token y vista de inicio protegida.
- Integracion API: usa `VITE_API_URL` para comunicarse con `keypa_backend`.

## Requisitos

- Node.js 20+
- Backend ejecutandose (por defecto en `http://localhost:3000`)

## Instalacion

1. Instalar dependencias:

```bash
npm install
```

2. Crear archivo de entorno:

```bash
Copy-Item .env.example .env
```

3. Configurar `VITE_API_URL` en `.env`.

## Comandos principales

- Desarrollo:

```bash
npm run dev
```

- Build:

```bash
npm run build
```

- Vista previa de build:

```bash
npm run preview
```

- Lint:

```bash
npm run lint
```

## Tailwind CSS

- Configuracion: `tailwind.config.js` y `postcss.config.js`
- Entrada global: `src/index.css`
- Uso: clases utilitarias directamente en componentes JSX

## Flujo recomendado con backend

En `keypa_backend` ejecutar migraciones y seeders:

```bash
npm run prisma:migrate -- --name init
npm run db:seed
```

Luego iniciar backend y frontend en paralelo.

## Docker

La orquestacion Docker de frontend + backend + mysql ahora esta en `keypa_outlet/docker-compose.yml`.

Comandos:

```bash
cd c:\laragon\www\keypa_outlet
docker compose up --build
```

Accesos esperados:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3000`

Para detener:

```bash
docker compose down
```
