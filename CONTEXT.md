# CONTEXT - Keypa Frontend

## Objetivo

Aplicacion web administrativa para autenticacion, panel y gestion operativa de:

- productos, marcas y categorias
- ubicaciones (ciudades y colonias)
- clientes, sucursales y almacenes
- inventarios y ventas

## Stack

- React 19 + Vite
- React Router
- Axios
- Tailwind CSS
- Zustand (estado puntual)
- JWT Decode

## Estructura principal

```text
keypa_frontend/
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── core/
│   │   ├── api/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── router/
│   │   └── utils/
│   └── modules/
│       ├── auth/
│       ├── dashboard/
│       ├── productos/
│       ├── ubicaciones/
│       ├── clientes/
│       ├── sucursales/
│       ├── almacenes/
│       ├── inventarios/
│       ├── ventas/
│       └── usuarios/
├── public/
├── index.html
└── vite.config.js
```

## Arquitectura frontend

- `src/core` contiene piezas transversales (UI base, layout admin, router, helpers y API).
- `src/modules` separa dominio por funcionalidad.
- Cada modulo usa componentes de vista + hooks de pagina + servicios de API.
- Se usa un patron de hooks para reducir logica en paginas:
	- data
	- filtros
	- acciones
	- modales
- Para CRUD repetitivos se usa `src/core/hooks/useCrudBase.js`.

## Rutas de aplicacion

- Publicas:
	- `/login`
	- `/forgot-password`
	- `/reset-password`
- Privadas bajo `/admin`:
	- dashboard
	- productos, marcas, categorias
	- ciudades, colonias
	- clientes, sucursales, almacenes
	- inventarios
	- ventas

## Autenticacion y sesion

- Provider global: `AuthProvider`.
- Token almacenado en `localStorage` con llave `keypa_token`.
- Cliente HTTP con interceptor Bearer en `src/core/api/http.js`.
- Carga de sesion via endpoint `me` al iniciar app.
- Si token expira o es invalido, se limpia sesion local.

## Integracion con backend

- URL base por `VITE_API_URL`.
- Formato de IDs semanticos esperado desde backend:
	- idUsuario
	- idProducto
	- idCategoria
	- idMarca
	- idCiudad
	- idColonia
	- idCliente
	- idSucursal
	- idAlmacen
	- idInventario
	- idVenta

## Convenciones de codigo

- Idioma del dominio, UI y mensajes: espanol.
- Mensajes de error orientados a usuario final.
- Servicios por modulo, sin mezclar endpoints de dominios distintos.
- En archivos `.js` donde el parser no tenga JSX habilitado, usar `createElement` en renderizadores inline.

## Reglas funcionales

- Slug generado automaticamente desde nombre cuando aplique.
- Validar conflictos de slug/entidad desde backend y reflejar mensaje claro en UI.
- CRUD con filtros consistentes y recarga segura de datos.
- Paginacion usable en movil (sin quiebres visuales).

## Comandos locales

- `npm run dev`
- `npm run build`
- `npm run preview`
- `npm run lint`

## Docker

El stack se levanta desde carpeta raiz `keypa_outlet`.

- `npm run upd`
- `npm run logs`
- `npm run down`
