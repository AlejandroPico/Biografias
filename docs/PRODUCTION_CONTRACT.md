# Contrato de la versión multiusuario

Este documento separa los comportamientos ya demostrables en el navegador de las garantías que debe
proporcionar el servidor antes de aceptar datos reales.

## Servicios y rutas previstas

| Módulo | Operaciones principales |
|---|---|
| Identidad | `POST /api/v1/auth/registrations`, `/sessions`, `/mfa/challenges`; revocar y recuperar |
| Personas | `GET/POST /api/v1/people`, `PATCH /people/{id}`, permisos y publicación |
| Reclamaciones | `POST /people/{id}/claims`, evidencia, revisión, conflicto y retirada |
| Familia | relaciones bidireccionales, árboles, evidencia y propuestas de enlace |
| Cronología | eventos, participantes, lugares, residencias, migraciones y fuentes |
| Entrevistas | sesiones, consentimiento, preguntas, respuestas, versiones y transcripciones |
| Archivo | intención de carga, confirmación de hash, variantes, permisos y descarga firmada |
| Mensajes | conversaciones, solicitudes, entregas, lectura, bloqueo y denuncia |
| Portabilidad | exportaciones, importaciones, borrado y estado de cada trabajo |

Las colecciones usan paginación por cursor. Las escrituras aceptan una clave de idempotencia y
devuelven una versión del recurso para evitar que una edición silencie otra. Los errores siguen
`application/problem+json` y nunca incluyen valores sensibles.

## Autorización y visibilidad

Los niveles `PRIVATE`, `FAMILY` y `PUBLIC` se evalúan en el servidor para cada recurso, no solo en la
interfaz. Ser propietario de una ficha permite editarla, pero publicar medios o testimonios de
terceros puede requerir consentimientos adicionales. Un perfil mencionado permanece incompleto y
reclamable; no concede acceso a quien comparta nombre o identificador.

La reclamación de identidad sigue este flujo:

1. el usuario presenta motivo y evidencia por un canal privado;
2. el sistema propone coincidencias sin exponer identificadores;
3. una revisión autorizada acepta, solicita evidencia o rechaza;
4. los perfiles duplicados se vinculan o fusionan con historial reversible;
5. toda decisión queda auditada y puede disputarse.

## Datos sensibles

- Contraseñas: función de derivación resistente y parámetros actualizables; nunca reversibles.
- DNI, Seguridad Social, correo y teléfono: cifrado de campo con claves rotables.
- Detección de igualdad: huella determinista con clave y contexto, separada del texto cifrado.
- Sesiones: tokens de corta duración, rotación, revocación y huellas en base de datos.
- Logs: identificadores internos y resultados, sin cuerpos de mensajes ni biografías.

Los perfiles, relaciones y mensajes viven en PostgreSQL. Las fotos, audios, vídeos y documentos van a
almacenamiento de objetos cifrado. La aplicación recibe URLs firmadas breves y los archivos nuevos
pasan por límites de tamaño, detección del tipo real, eliminación controlada de metadatos y análisis
de malware antes de estar disponibles.

## Mensajería

Encontrar una ficha no habilita contacto directo. Primero se envía una solicitud contextual; el
destinatario puede aceptar, rechazar o bloquear. El servidor aplica bloqueo y límites antes de
entregar un mensaje. Se conservan lo mínimo necesario para entrega, lectura, denuncia y borrado
según la política vigente.

El esquema reserva `body_ciphertext` para el cuerpo cifrado. El diseño criptográfico final deberá
decidir explícitamente si el servidor puede moderar contenido o si se adopta cifrado de extremo a
extremo; no se afirmará lo segundo sin gestión real de claves en los clientes.

## Aplicaciones móviles

Capacitor reutiliza la PWA en Android e iOS. En producción, los tokens se almacenan en el almacén
seguro del sistema, los permisos de micrófono/fotos se solicitan en contexto y los archivos se
mantienen en una cola cifrada hasta confirmar su carga. Windows y Linux continúan cubiertos como PWA;
un envoltorio de escritorio solo se añadirá si aporta acceso sin conexión o integración nativa real.

## Criterios para activar escrituras reales

- pruebas de autorización negativas por cada recurso;
- verificación de correo, MFA opcional y recuperación segura;
- cifrado y rotación de claves probados;
- análisis y cuarentena de archivos;
- auditoría, alertas, copias y restauración ensayada;
- exportación y borrado verificables;
- términos, privacidad, consentimiento y proceso para menores revisados;
- pruebas de accesibilidad, carga y respuesta ante incidentes.
