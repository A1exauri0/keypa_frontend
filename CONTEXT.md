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
- Token JWT para sesión persistente.

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

## Reglas de documentacion

- Toda funcion asincrona en servicios que consume endpoints debe incluir un comentario breve explicando que endpoint usa y que retorna.
- Cuando se creen modulos de dominio (por ejemplo categorias, marcas, productos), cada modulo debe tener su propio archivo de servicios para mantener separacion de responsabilidades.

## Reglas funcionales de catalogo

- El slug no se muestra al usuario en formularios; se genera automaticamente desde el nombre (por ejemplo: "Pantalon azul" -> "pantalon-azul").
- Antes de crear o actualizar una entidad con slug, se debe validar que no exista ya en backend y mostrar mensaje claro de conflicto.
- En vistas CRUD se debe mantener consistencia visual: mismo alto para buscadores, selects y botones de acciones.
- La paginacion debe verse correctamente en movil: controles alineados, centrados y sin selector de tamano por pagina en pantallas pequenas.

## Docker

El stack se levanta desde keypa_outlet.

Comandos utiles:
- npm run upd
- npm run logs
- npm run down
