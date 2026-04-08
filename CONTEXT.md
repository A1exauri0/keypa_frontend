# CONTEXT - Keypa Frontend

## Vista rapida

Cliente web para autenticacion, panel y gestion de catalogos/seguridad.

## Stack

- React + Vite
- React Router
- Axios
- Tailwind CSS

## Mapa visual del proyecto

```text
keypa_outlet/
└── keypa_frontend/
		├── src/
		│   ├── modules/
		│   ├── context/
		│   ├── router/
		│   └── services/
		├── public/
		├── index.html
		└── vite.config.js
```

## Integracion con backend

- Base URL por variable VITE_API_URL.
- Login por correo y contrasena.
- Token JWT para sesion persistente.

## Contrato de backend relevante

- IDs semanticos por entidad:
	- idUsuario
	- idProducto
	- idRol
	- idPermiso
- Endpoints de backend organizados por archivos router:
	- auth.router.js
	- usuarios.router.js
	- roles.router.js
	- permisos.router.js
- Permisos efectivos del usuario:
	- por rol
	- mas permisos directos

## Convencion de idioma

- Componentes, vistas, helpers y comentarios en espanol.
- Mensajes de interfaz y errores en espanol.

## Docker

El stack se levanta desde keypa_outlet.

Comandos utiles:
- npm run upd
- npm run logs
- npm run down
