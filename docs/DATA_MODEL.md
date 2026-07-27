# Modelo de datos

Las tres migraciones contienen 92 tablas. El número no es el objetivo: la separación permite
conservar historia, procedencia, permisos y formatos heterogéneos sin convertir una persona en una
fila inmanejable.

| Área | Tablas principales |
|---|---|
| Identidad y acceso | usuarios, credenciales, sesiones, roles, permisos, hogares e invitaciones |
| Persona y privacidad | personas, nombres, contactos, identificadores, preferencias, consentimientos y auditoría |
| Reclamaciones | menciones, reclamaciones, evidencias y candidatos de coincidencia |
| Familia | relaciones, pruebas de parentesco, árboles y miembros |
| Geografía | lugares, residencias, migraciones, viajes y paradas |
| Vida | eventos, participantes, épocas históricas, educación, trabajo y servicio |
| Relato | historias versionadas, sabiduría, reflexiones, cartas, recetas y tradiciones |
| Entrevistas | sesiones, catálogo de preguntas, respuestas y segmentos |
| Archivo | medios, variantes, vínculos, transcripciones, subtítulos y documentos |
| Mensajería | conversaciones, participantes, mensajes, adjuntos, lecturas, solicitudes y bloqueos |
| Procedencia | fuentes, citas, etiquetas y colecciones |
| IA con consentimiento | perfiles de permiso, modelos de voz/avatar, simulaciones y registro de interacciones |
| Comunidad y gobierno | comentarios, reacciones, denuncias y moderación |
| Ciclo de vida | retención, borrado, exportación, importación, notificaciones y copias |

## Reglas importantes

- Las claves son UUID de texto para permitir creación desconectada y sincronización posterior.
- Los recursos publicables tienen visibilidad explícita.
- Datos oficiales y de contacto viven en tablas privadas con valores cifrados.
- Una mención crea un perfil incompleto y reclamable, nunca una identidad verificada.
- La correlación propone candidatos; una coincidencia no fusiona perfiles automáticamente.
- El consentimiento se modela por alcance, finalidad, vigencia y revocación.
- Los relatos y transcripciones conservan versiones.
- Una cita conecta una afirmación con su fuente y permite expresar confianza.
- Los archivos binarios quedan fuera de SQL; la base conserva metadatos e integridad.
- Los modelos y simulaciones de IA están separados del material original.
- El cuerpo de los mensajes se cifra en la versión de servidor y los bloqueos se aplican antes de
  entregar contenido.

## Migraciones

- `V1__mindsage_foundation.sql`: estructura biográfica, archivo, consentimiento y gobierno.
- `V2__demo_memories.sql`: tres perfiles ficticios para desarrollo.
- `V3__identity_claims_and_messaging.sql`: perfiles reclamables, coincidencias y mensajería privada.

`python tools/validate_schema.py` ejecuta todas las migraciones en una SQLite temporal, comprueba las
claves foráneas y valida las cantidades exactas del conjunto demo.
