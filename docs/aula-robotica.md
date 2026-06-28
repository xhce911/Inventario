# Aula De Robotica

## Distribucion Base
- Closets superiores: `C1`, `C2`, `C3`, `C4`, `C5`, `C6`.
- Estaciones izquierdas: `10`, `9`, `8`, `7`, `6`.
- Estaciones derechas: `1`, `2`, `3`, `4`, `5`.
- Estaciones centrales: `11`, `12`.
- Areas centrales:
  - Mesa de trabajo A.
  - Mesa de trabajo B.
  - Mesa de montaje.
  - Mesa de pruebas.

## Uso Del Mapa
El mapa es la entrada principal para consultar el inventario por punto del layout. Cada elemento seleccionable debe abrir un panel de detalle con conteos, estado e incidencias.

En escritorio y tablet se muestra el layout espacial completo. En movil se prioriza una vista compacta por puntos del layout para que el inventario pueda consultarse sin desplazamiento horizontal obligatorio.

Las estaciones deben mostrar su codigo, conteo de activos y estado resumido. Las palomitas de verificacion se reservan para componentes individuales de cada equipo o kit.

La navegacion principal del inventario separa cuatro vistas: `Layout`, `Principal`, `Cartas` y `Tabla`. La vista `Principal` muestra el overview general; la vista `Cartas` agrupa puntos del layout en objetos colapsables. La creacion de activos se activa desde un boton flotante y continua en un modal.

## Edicion Del Layout
- El punto seleccionado puede editar nombre visible, zona, lado del mapa y orden visual.
- El layout se edita sobre una rejilla imantada; cada closet, equipo y mesa tiene columna, fila, ancho y alto.
- El editor permite agregar closets, equipos y mesas.
- La eliminacion de una pieza del layout solo debe permitirse cuando no tenga activos asociados.
- Los cambios del layout deben actualizar la misma entidad `locations`; no se debe crear una copia paralela solo para el mapa.
- Los closets permanecen en la parte superior del layout base.

## Reglas De Ubicacion
- Un activo fisico debe pertenecer a una sola ubicacion actual.
- Un kit puede tener multiples componentes.
- Una estacion de computo muestra solo los componentes de revision operativa: mouse, teclado, bocinas y mousepad.
- Los closets agrupan kits, cajas, sensores, motores, cables y consumibles.
