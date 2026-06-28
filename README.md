# Inventario RoboLab

Plataforma para gestionar el inventario de un aula de robotica: closets, estaciones de computo, kits, componentes, auditorias y reportes.

## Estructura

```txt
Inventario/
├─ AGENTS.md
├─ README.md
├─ docs/
├─ design/
├─ archive/
├─ agents/
└─ app/
   ├─ frontend/
   ├─ backend/
   └─ database/
```

## Inicio Rapido

```bash
cd app/frontend
npm install
npm run dev
```

## Autenticacion

El frontend es compatible con Firebase Authentication. Para conectarlo a un proyecto real:

```bash
cd app/frontend
cp .env.example .env
```

Luego llena las variables `VITE_FIREBASE_*` con la configuracion de la app web de Firebase. Sin esas variables, la app usa modo demo local.

## Sincronizacion

Cuando `app/frontend/.env` existe con Firebase configurado, la app sincroniza `locations`, `assets` y `audits` en Firestore bajo `inventories/{VITE_FIREBASE_INVENTORY_SCOPE}`. En modo demo usa `localStorage` y los datos mock de `app/frontend/src/data/inventory.ts`.

Si el scope de Firestore esta vacio, la vista operativa muestra `Inicializar MVP` para sembrar los datos base.

## Referencias
- Sistema visual: `design/DESIGN.md`
- Prototipo original: `archive/code.prototype.html`
- Modelo de datos: `docs/data-model.md`
- Autenticacion: `docs/authentication.md`
- Reglas para agentes: `AGENTS.md`
