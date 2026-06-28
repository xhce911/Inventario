# Autenticacion

## Frontend
La app usa Firebase Web Auth cuando existen las variables `VITE_FIREBASE_*` en `app/frontend/.env`.

Si esas variables no existen, el frontend entra en modo demo local para que el inventario pueda probarse sin bloquear el desarrollo. En modo demo los datos mock se cargan desde `app/frontend/src/data/inventory.ts` y los cambios se guardan en `localStorage`.

## Variables
Copiar `app/frontend/.env.example` a `app/frontend/.env` y llenar los valores del proyecto web registrado en Firebase.

```txt
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=
VITE_FIREBASE_INVENTORY_SCOPE=aula-robotica
```

`VITE_FIREBASE_MEASUREMENT_ID` solo habilita Analytics cuando el navegador lo soporta. Auth y Firestore solo requieren las otras variables `VITE_FIREBASE_*` de la app web.

## Sincronizacion Firestore
Cuando Firebase esta configurado, el frontend escucha Firestore en tiempo real con `onSnapshot`.

El alcance del inventario se define con `VITE_FIREBASE_INVENTORY_SCOPE`. Por defecto usa `aula-robotica`.

```txt
inventories/{scope}/locations/{locationId}
inventories/{scope}/assets/{assetId}
inventories/{scope}/audits/{auditId}
```

Los documentos se guardan con la misma forma camelCase usada por React. El backend puede mapear esos campos al modelo SQL versionado cuando exista persistencia propia.

## Backend
Cuando la API empiece a proteger rutas reales, el frontend debe enviar el ID token de Firebase en:

```txt
Authorization: Bearer <firebase-id-token>
```

El backend debe verificar ese token con Firebase Admin SDK antes de aceptar escritura de inventario, auditorias o usuarios.
