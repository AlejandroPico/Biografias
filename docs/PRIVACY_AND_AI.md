# Privacidad, dignidad e inteligencia artificial

MindSage trata recuerdos íntimos, datos familiares y, potencialmente, información de personas
fallecidas. La seguridad técnica por sí sola no basta: el producto necesita límites éticos visibles.

## Condiciones antes de almacenar datos reales

1. Consentimiento informado del protagonista o base jurídica documentada.
2. Permisos independientes para conservar, compartir, transcribir y reutilizar cada medio.
3. Acceso privado por defecto y publicación mediante revisión explícita.
4. Exportación completa y proceso verificable de borrado.
5. Cifrado en tránsito y reposo, gestión de secretos y copias cifradas.
6. Registro de accesos y cambios sin incluir contenido sensible en los logs.
7. Política para menores, terceros mencionados y datos de salud, religión o política.

## Recreaciones futuras

Clonar una voz o representar a una persona fallecida no es una función automática de una biografía.
Requiere un consentimiento específico para cada modalidad y finalidad. Además:

- la experiencia debe mostrar permanentemente que es una simulación;
- una persona responsable debe poder suspenderla o revocar su permiso;
- las respuestas generadas no pueden presentarse como palabras reales del protagonista;
- se deben mantener separadas las fuentes originales, inferencias y contenido sintético;
- toda interacción debe dejar una trazabilidad accesible;
- no debe usarse para decisiones médicas, legales, financieras ni para suplantación.

La estructura de datos ya reserva estas garantías, pero las funciones de IA permanecen desactivadas
hasta que existan controles técnicos, legales y de producto suficientes.

## Amenazas prioritarias

| Riesgo | Control previsto |
|---|---|
| Acceso indebido | mínimo privilegio, MFA, autorización por recurso y sesiones revocables |
| Borrado o sabotaje | auditoría inmutable, versiones, copias verificadas y restauración probada |
| Filtración de medios | URLs firmadas, análisis de archivos, cifrado y separación por propietario |
| Suplantación | etiquetado de contenido sintético, consentimiento y registro de generación |
| Inyección o abuso | validación, límites de tamaño/tasa, CSP y consultas parametrizadas |
| Dependencias comprometidas | lockfiles, Dependabot, CI y revisión de actualizaciones |

