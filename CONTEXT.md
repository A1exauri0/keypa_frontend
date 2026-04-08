# CONTEXT - Keypa Frontend

## Proposito

Aplicacion cliente para autenticacion y experiencia principal de usuarios de Keypa.

## Stack

- React + Vite
- React Router
- Axios
- Tailwind CSS

## Estructura principal

- Organizacion general del sistema (carpeta padre):
	- keypa_outlet/
	- keypa_outlet/keypa_backend/
	- keypa_outlet/keypa_frontend/
- Modulos y paginas: src/modules/
- Estado de autenticacion: src/context/
- Servicios HTTP: src/modules/**/services/

## Integracion con backend

- URL base por variable VITE_API_URL.
- Login por correo y contrasena.
- Manejo de token para sesion persistente.

## Convencion de idioma del proyecto

- Componentes, vistas, helpers y comentarios deben escribirse en espanol.
- Mantener textos funcionales y mensajes internos en espanol.

## Convenciones de backend relevantes para frontend

- Los identificadores de entidades se exponen con nombres semanticos (ejemplo: idUsuario, idProducto).
- Mantener consistencia de naming al mapear respuestas del API en componentes y stores.
- Tablas padre del backend en plural (usuarios, productos, roles, permisos).
- Permisos efectivos del usuario: permisos por rol + permisos directos adicionales.

## Docker

El stack se levanta desde la carpeta padre keypa_outlet con docker-compose.yml.

Comandos utiles desde keypa_outlet:
- npm run upd
- npm run logs
- npm run down
