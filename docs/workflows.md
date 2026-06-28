# Flujos De Trabajo

## Alta De Equipo
1. Seleccionar punto del layout.
2. Registrar categoria, codigo, nombre y componentes.
3. Asignar estado inicial.
4. Guardar responsable y fecha.

Implementado en frontend como flujo `Alta de activo`.

## Inicializacion MVP
1. Entrar con Firebase configurado.
2. Si Firestore no tiene ubicaciones, usar `Inicializar MVP`.
3. Confirmar que aparecen closets, estaciones, mesas y activos base.

Implementado en frontend como siembra manual desde los datos mock hacia el scope actual de Firestore o hacia `localStorage` en modo demo.

## Edicion De Layout
1. Abrir la vista `Layout`.
2. Activar `Editar layout`.
3. Seleccionar o arrastrar un punto del aula.
4. Soltar el punto en la rejilla para guardar su posicion.

Implementado en frontend como drag and drop imantado a la rejilla 12x14. Si el punto cae sobre otro elemento, se guarda en la celda libre mas cercana para mantener el orden visual del aula.

## Revision De Closet
1. Abrir closet desde el mapa.
2. Revisar categorias y conteos.
3. Confirmar componentes esperados.
4. Registrar faltantes o mantenimiento.
5. Cerrar auditoria.

Implementado en frontend como seleccion de punto del layout, edicion inline desde el panel derecho y cierre de revision.

## Revision De Estacion
1. Abrir estacion desde el mapa.
2. Verificar mouse, teclado, bocinas y mousepad.
3. Registrar incidencia si algo falta o falla.
4. Actualizar estado.

Implementado en frontend como revision de activo desde una estacion seleccionada, con edicion de componentes desde el panel derecho.

## Correccion De Asignacion
1. Seleccionar el punto donde aparece el activo mal asignado.
2. Abrir el panel derecho.
3. Cambiar `Ubicacion` en la tarjeta del activo.
4. Guardar cambios.

Tambien se puede eliminar un activo registrado por error desde el mismo panel. La app limpia duplicados de `Equipo 1` conservando el primer activo de la lista sincronizada y eliminando los registros restantes.

## Exportacion
1. Filtrar inventario.
2. Seleccionar formato.
3. Generar archivo.
4. Registrar fecha de exportacion si es reporte oficial.

Implementado en frontend como exportacion CSV desde `Tabla` y `Reportes`. El CSV incluye codigo, nombre, categoria, estado, ubicacion, responsable, ultima revision, componentes y notas.

## Reportes
1. Revisar conteos por estado y categoria.
2. Identificar activos criticos del filtro actual.
3. Exportar corte operativo.
4. Registrar nuevos activos si el corte detecta faltantes no dados de alta.

Implementado en frontend como vista `Reportes`.

## Auditorias
1. Seleccionar punto del layout.
2. Revisar activos y componentes en el panel derecho.
3. Cerrar revision.
4. Consultar historial y puntos pendientes.

Implementado en frontend como cierre desde panel derecho y vista `Auditorias`.
