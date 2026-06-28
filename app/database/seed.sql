INSERT INTO locations (id, code, type, name, description) VALUES
  ('closet-c1', 'C1', 'closet', 'Closet C1', 'Closet superior izquierdo'),
  ('closet-c2', 'C2', 'closet', 'Closet C2', 'Closet superior'),
  ('closet-c3', 'C3', 'closet', 'Closet C3', 'Closet superior'),
  ('closet-c4', 'C4', 'closet', 'Closet C4', 'Closet superior'),
  ('closet-c5', 'C5', 'closet', 'Closet C5', 'Closet superior'),
  ('closet-c6', 'C6', 'closet', 'Closet C6', 'Closet superior derecho'),
  ('station-1', 'EST-01', 'station', 'Estacion 1', 'Estacion de computo lado este'),
  ('station-10', 'EST-10', 'station', 'Estacion 10', 'Estacion de computo lado oeste');

INSERT INTO assets (id, code, name, category, status, location_id, last_review, responsible, notes) VALUES
  ('asset-ev3-001', 'KIT-EV3-001', 'Kit Lego EV3 1', 'Lego EV3', 'ok', 'closet-c1', '2026-06-20', 'Encargado del aula', 'Inventario completo.'),
  ('asset-ev3-002', 'KIT-EV3-002', 'Kit Lego EV3 2', 'Lego EV3', 'incompleto', 'closet-c1', '2026-06-18', 'Encargado del aula', 'Falta un sensor ultrasonico.'),
  ('asset-pc-001', 'EQ-001', 'Equipo de computo 1', 'Computo', 'ok', 'station-1', '2026-06-22', 'Soporte tecnico', 'Sin incidencias.');
