# Producto

## Vision
Crear una plataforma operativa para que docentes, encargados de laboratorio y alumnos autorizados puedan saber que existe en el aula de robotica, donde esta, en que estado se encuentra y que falta revisar.

## Usuarios
- Encargado del aula: administra inventario, auditorias y reportes.
- Docente: consulta disponibilidad de kits y estaciones.
- Alumno autorizado: registra uso, devolucion o incidencias segun permisos.
- Administrador tecnico: mantiene usuarios, respaldos e integraciones.

## Funcionalidades Iniciales
- Mapa del aula con closets `C1-C6`, equipos `1-12` y mesas de trabajo.
- Panel de detalle por closet o estacion.
- Tabla de inventario con busqueda y filtros.
- Vista movil operativa con tarjetas de inventario y mapa compacto.
- Edicion basica del layout por punto seleccionado.
- Cambio simple entre layout y tabla dentro de la misma vista operativa.
- Vista `Principal` para overview general de metricas, estados, categorias e incidencias.
- Vista `Cartas` para navegar por puntos del layout con activos y componentes colapsables.
- Vista `Cartas` con edicion rapida de estado, observaciones y componentes sin abrir modales.
- Paneles laterales ocultables para aprovechar pantallas pequenas o anchas.
- Editor de layout en rejilla imantada para mover y redimensionar closets, equipos y mesas.
- Alta y eliminacion de piezas del layout desde el modo de edicion, protegiendo puntos que ya tienen activos.
- Panel derecho de detalle responsivo: lateral en pantallas anchas y apilado/ocultable en pantallas menores.
- Creacion de equipos/kits desde boton de accion flotante que abre selector y formulario modal.
- El panel derecho se muestra u oculta desde la barra superior para aprovechar espacio de pantalla.
- El panel derecho permite editar inline nombre, categoria, estado, responsable, observaciones y componentes del activo seleccionado.
- Estados visibles: ok, incompleto, mantenimiento, faltante.
- Registro de componentes esperados contra componentes encontrados.
- Para equipos de computo, la revision inicial se limita a mouse, teclado, bocinas y mousepad.
- Preparacion para auditorias periodicas.

## Funcionalidades Futuras
- Escaneo por QR o codigo de barras.
- Prestamos y devoluciones.
- Historial de cambios por usuario.
- Exportacion a Excel y PDF.
- Alertas por faltantes o mantenimiento vencido.
- Roles y permisos.
