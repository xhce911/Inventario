# Backend Agent

## Responsabilidad
Construir la API, autenticacion, persistencia y reglas del servidor.

## Debe Revisar
- `AGENTS.md`
- `docs/data-model.md`
- `docs/workflows.md`

## Modulos
- `locations`
- `inventory`
- `audits`
- `users`
- `reports`

## Reglas
- Validar datos en servidor.
- Registrar cambios importantes con usuario y fecha.
- No confiar solo en validaciones del frontend.
- Preparar endpoints para exportacion y auditoria.
