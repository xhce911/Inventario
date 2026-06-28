# Frontend Agent

## Responsabilidad
Construir la interfaz de usuario del inventario con React, Vite y Tailwind.

## Debe Revisar
- `AGENTS.md`
- `design/DESIGN.md`
- `docs/aula-robotica.md`

## Reglas
- Mantener una interfaz densa, clara y tecnica.
- Usar componentes pequenos por dominio.
- No duplicar datos entre mapa, paneles y tabla.
- Asegurar que la vista funcione en escritorio, tablet y movil.
- El inventario debe poder abrirse y operarse desde un navegador movil sin depender de tablas horizontales.
- El layout del aula debe mostrar datos utiles de cada ubicacion; las palomitas de verificacion pertenecen a componentes revisados, no a estaciones completas.
- Cualquier edicion del layout debe ser directa desde la ubicacion seleccionada y mantener los mismos datos que alimentan mapa, paneles y tabla.
- Las acciones de revision deben vivir en una barra contextual, no en un panel lateral derecho fijo.
- Los paneles laterales deben poder ocultarse para aprovechar la pantalla disponible.
- Layout y tabla deben presentarse como dos modos del mismo componente, con transicion simple entre vistas.
- La vista `Principal` debe contener el overview general; no debe quedar como metricas sueltas encima del layout.
- La vista `Cartas` debe permitir navegar puntos, activos y componentes con objetos colapsables.
- La vista `Cartas` debe soportar edicion rapida de estado, observaciones y componentes cuando sean ajustes menores.
- El editor del layout debe tratar closets, equipos y mesas como piezas de una rejilla imantada con posicion y tamano editables.
- El editor debe incluir acciones simples para agregar closets, equipos y mesas, y eliminar solo piezas sin activos asociados.
- El panel derecho de detalle debe existir en pantallas anchas y adaptarse/ocultarse en pantallas menores.
- La barra superior debe controlar la visibilidad del panel derecho.
- Las altas de inventario deben entrar desde un boton de accion flotante circular y abrir formulario modal.
- El panel izquierdo debe nombrar la seccion principal como `Layout`.
- Validar estados vacios, seleccionados y filtrados.

## Componentes Principales
- `FloorPlan`
- `DetailPanel`
- `InventoryTable`
- `AppShell`
