# Modelo de datos

La migración fundacional contiene 81 tablas. El número no es el objetivo: la separación existe para
conservar historia, procedencia, permisos y formatos heterogéneos sin convertir una persona en una
fila inmanejable.

| Área | Tablas principales |
|---|---|
| Identidad y acceso | usuarios, credenciales, sesiones, roles, permisos, hogares e invitaciones |
| Persona y privacidad | personas, nombres, contactos, identificadores, preferencias, consentimientos y auditoría |
| Familia | relaciones, pruebas de parentesco, árboles y miembros |
| Geografía | lugares, residencias, migraciones, viajes y paradas |
| Vida | eventos, participantes, épocas históricas, educación, trabajo y servicio |
| Relato | historias versionadas, sabiduría, reflexiones, cartas, recetas y tradiciones |
| Entrevistas | sesiones, catálogo de preguntas, respuestas y segmentos |
| Archivo | medios, variantes, vínculos, transcripciones, subtítulos y documentos |
| Procedencia | fuentes, citas, etiquetas y colecciones |
| IA con consentimiento | perfiles de permiso, modelos de voz/avatar, simulaciones y registro de interacciones |
| Comunidad y gobierno | comentarios, reacciones, denuncias y moderación |
| Ciclo de vida | retención, borrado, exportación, importación, notificaciones y copias |

## Reglas importantes

- Las claves son UUID de texto para permitir creación desconectada y sincronización posterior.
- Los recursos publicables tienen visibilidad explícita.
- El consentimiento se modela por alcance, finalidad, vigencia y revocación.
- Los relatos y transcripciones conservan versiones; corregir no debe borrar el testimonio previo.
- Una cita conecta una afirmación con su fuente y permite expresar nivel de confianza.
- Los archivos binarios no se guardarán dentro de SQLite: la base conserva metadatos, integridad y
  ubicación del objeto.
- Los modelos y simulaciones de IA son registros separados del material original.

## Migraciones

- `V1__mindsage_foundation.sql`: estructura completa e índices.
- `V2__demo_memories.sql`: tres perfiles ficticios para desarrollo.

`python tools/validate_schema.py` ejecuta ambas migraciones en una SQLite temporal, comprueba las
claves foráneas y valida las cantidades mínimas del conjunto demo.

