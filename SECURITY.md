# Seguridad

## Reportar una vulnerabilidad

No publiques detalles explotables en una incidencia pública. Usa la opción **Security → Report a
vulnerability** del repositorio para enviar un informe privado con impacto, pasos de reproducción y,
si es posible, una corrección sugerida.

El proyecto intentará confirmar la recepción en siete días. No hay aún un servicio productivo con
datos reales; si eso cambia, este documento deberá incorporar objetivos de respuesta y versiones
soportadas.

## Alcance actual

La aplicación de GitHub Pages permite crear perfiles, grabar y subir archivos, pero todo queda en
`localStorage` e `IndexedDB` del navegador. El inicio de sesión y los mensajes son simulaciones
locales, no controles de seguridad. La API expone lecturas públicas y deniega el resto.

No introduzcas secretos, DNI, Seguridad Social, teléfonos, información personal real, grabaciones
privadas ni credenciales en el repositorio o en la demostración publicada.

## Reglas para contribuciones

- los secretos se proporcionan mediante variables de entorno o almacenes de secretos;
- no se registran tokens, contraseñas ni contenido biográfico sensible;
- cada escritura futura exige autenticación, autorización por recurso, validación y auditoría;
- los identificadores oficiales se cifran y las búsquedas exactas usan huellas con clave;
- una reclamación de perfil nunca se aprueba por coincidencia automática;
- los archivos subidos deberán verificarse por tipo real, tamaño, malware y metadatos;
- cualquier función de IA requiere revisión específica de consentimiento y abuso.
