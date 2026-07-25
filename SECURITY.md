# Seguridad

## Reportar una vulnerabilidad

No publiques detalles explotables en una incidencia pública. Usa la opción **Security → Report a
vulnerability** del repositorio para enviar un informe privado con impacto, pasos de reproducción y,
si es posible, una corrección sugerida.

El proyecto intentará confirmar la recepción en siete días. No hay aún un servicio productivo con
datos reales; si eso cambia, este documento deberá incorporar objetivos de respuesta y versiones
soportadas.

## Alcance actual

La demo de GitHub Pages usa únicamente perfiles ficticios y borradores locales del navegador. La API
expone lecturas públicas y deniega el resto. No introduzcas secretos, información personal real,
grabaciones privadas ni credenciales en el repositorio.

## Reglas para contribuciones

- los secretos se proporcionan mediante variables de entorno o almacenes de secretos;
- no se registran tokens, contraseñas ni contenido biográfico sensible;
- cada escritura futura exige autenticación, autorización por recurso, validación y auditoría;
- los archivos subidos deberán verificarse por tipo real, tamaño, malware y metadatos;
- cualquier función de IA requiere revisión específica de consentimiento y abuso.

