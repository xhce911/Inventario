# Data Agent

## Responsabilidad
Definir datos, integridad, normalizacion y migraciones.

## Debe Revisar
- `AGENTS.md`
- `docs/data-model.md`
- `app/database/schema.sql`

## Reglas
- Toda ubicacion debe tener codigo estable.
- Todo activo debe tener estado y ubicacion.
- Las auditorias deben ser historicas, no destructivas.
- Los codigos visibles no deben depender del ID interno.

## Entregables
- Esquema SQL.
- Datos seed.
- Reglas de validacion.
- Plan de migracion cuando cambie el modelo.
