# AGENTS.md

## Objetivo
Construir una plataforma de inventario para un aula de robotica con mapa del salon, closets, estaciones de computo, kits, componentes, auditorias y reportes.

## Estado Actual
- `design/DESIGN.md` contiene el sistema visual base.
- `design/screen.png` conserva la referencia visual del prototipo.
- `archive/code.prototype.html` contiene la maqueta HTML original.
- `app/frontend` contiene la primera app modular.
- `app/backend` queda preparado para la API.
- `app/database` contiene el modelo inicial de datos.
- `docs/authentication.md` define la compatibilidad con Firebase Auth.

## Principios
- La vista principal debe ser una herramienta operativa, no una landing page.
- El mapa del aula y la tabla deben usar los mismos datos.
- Toda pieza inventariable debe tener ubicacion, estado, historial y responsable cuando aplique.
- Separar datos mock de datos reales.
- Evitar cambios visuales que rompan la lectura rapida del aula.
- Documentar decisiones de dominio en `docs/`.

## Dominios Iniciales
- Closets: `C1` a `C6`.
- Estaciones de computo: `1` a `10`.
- Categorias: `Lego EV3`, `Robotkit`, `DYGO`, `Electronica`, `Computo`.
- Estados: `ok`, `incompleto`, `mantenimiento`, `faltante`.

## Convenciones Tecnicas
- Frontend: React + Vite + Tailwind.
- Autenticacion: Firebase Web Auth en frontend, Firebase Admin para verificacion futura en backend.
- Los componentes visuales viven en `app/frontend/src/components`.
- Los datos mock viven en `app/frontend/src/data`.
- Backend futuro: API por dominios en `app/backend/src`.
- Base de datos: SQL versionado en `app/database`.

## Flujo De Trabajo Para Agentes
1. Leer este archivo antes de modificar el proyecto.
2. Leer `docs/product.md` y `docs/data-model.md` si el cambio toca comportamiento o datos.
3. Mantener cambios pequenos y verificables.
4. Actualizar documentacion cuando cambien flujos, entidades o estados.
5. Verificar el frontend con `npm run build` dentro de `app/frontend`.

## Archivos De Agentes
- `agents/product-agent.md`: requerimientos y priorizacion.
- `agents/frontend-agent.md`: interfaz, componentes y accesibilidad.
- `agents/data-agent.md`: modelo de datos e integridad.
- `agents/backend-agent.md`: API, seguridad y persistencia.
- `agents/qa-agent.md`: pruebas y criterios de aceptacion.
- `agents/ops-agent.md`: despliegue, backups y operacion.
