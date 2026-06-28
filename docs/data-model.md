# Modelo De Datos

## Entidades

### locations
Ubicaciones fisicas dentro del aula.

| Campo | Tipo | Descripcion |
| --- | --- | --- |
| id | string | Identificador interno |
| code | string | Codigo visible, por ejemplo `C1` o `EST-01` |
| type | string | `closet`, `station`, `work_area` |
| name | string | Nombre legible |
| description | string | Detalle opcional |
| layout_side | string | Posicion visual del layout: `top`, `left`, `right`, `center` |
| layout_order | number | Orden visual dentro de su seccion del mapa |
| layout_x | number | Columna inicial en la rejilla del layout |
| layout_y | number | Fila inicial en la rejilla del layout |
| layout_w | number | Ancho en columnas de rejilla |
| layout_h | number | Alto en filas de rejilla |

### assets
Activos inventariables principales.

| Campo | Tipo | Descripcion |
| --- | --- | --- |
| id | string | Identificador interno |
| code | string | Codigo visible |
| name | string | Nombre |
| category | string | Categoria |
| status | string | `ok`, `incompleto`, `mantenimiento`, `faltante` |
| location_id | string | Ubicacion actual |
| last_review | date | Ultima revision |
| notes | string | Observaciones |

### asset_components
Componentes de un activo o kit.

| Campo | Tipo | Descripcion |
| --- | --- | --- |
| id | string | Identificador interno |
| asset_id | string | Activo padre |
| name | string | Nombre del componente |
| quantity_expected | number | Cantidad esperada |
| quantity_actual | number | Cantidad encontrada |
| status | string | Estado |

### audits
Revisiones de inventario.

| Campo | Tipo | Descripcion |
| --- | --- | --- |
| id | string | Identificador |
| date | date | Fecha |
| user_id | string | Responsable |
| location_id | string | Ubicacion auditada |
| notes | string | Observaciones |

En el frontend sincronizado con Firestore se usa el documento `AuditRecord` con campos camelCase para soportar la vista operativa:

| Campo | Tipo | Descripcion |
| --- | --- | --- |
| id | string | Identificador |
| date | date | Fecha de cierre |
| userId | string | Usuario que cerro la revision |
| userName | string | Nombre visible del responsable |
| locationId | string | Ubicacion auditada |
| locationCode | string | Codigo visible del punto |
| locationName | string | Nombre visible del punto |
| assetCount | number | Activos revisados |
| issueCount | number | Activos o componentes con incidencia |
| notes | string | Observaciones del cierre |

## Firestore
El MVP React sincroniza datos en:

| Coleccion | Contenido |
| --- | --- |
| `inventories/{scope}/locations` | Ubicaciones del layout |
| `inventories/{scope}/assets` | Activos con componentes embebidos |
| `inventories/{scope}/audits` | Cierres de revision |

`scope` se configura con `VITE_FIREBASE_INVENTORY_SCOPE` y por defecto es `aula-robotica`.

## Reglas De Integridad
- `assets.location_id` debe existir en `locations`.
- Todo activo debe tener un estado valido.
- Si un componente tiene `quantity_actual < quantity_expected`, el activo padre debe marcarse como `incompleto` o `faltante`.
- Las auditorias no deben borrar historial anterior.
