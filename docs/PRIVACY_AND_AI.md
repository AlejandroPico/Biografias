# Privacidad, dignidad e inteligencia artificial

MindSage trata recuerdos íntimos, datos familiares y, potencialmente, información de personas
fallecidas. La seguridad técnica por sí sola no basta: el producto necesita límites éticos visibles.

## Alcance de la demostración

GitHub Pages no tiene un servidor privado. El usuario local, sus mensajes y los metadatos se guardan
en `localStorage`; los medios, en `IndexedDB`. Esta separación permite probar el flujo, pero cualquier
persona con acceso al mismo perfil del navegador podría inspeccionarlos. No se deben usar datos
personales reales.

La interfaz distingue campos públicos y restringidos para representar el contrato futuro. DNI,
Seguridad Social, teléfono y correo nunca aparecen en la ficha pública ni en una exportación pública.
En producción tampoco deben guardarse en claro: se cifran con claves gestionadas fuera de la base.
Cuando haga falta detectar duplicados se usa una huella determinista con clave, no el identificador
original.

## Condiciones antes de almacenar datos reales

1. Consentimiento informado del protagonista o base jurídica documentada.
2. Permisos independientes para conservar, compartir, transcribir y reutilizar cada medio.
3. Acceso privado por defecto y publicación mediante revisión explícita.
4. Verificación humana de reclamaciones de identidad y resolución de conflictos.
5. Exportación completa y proceso verificable de borrado.
6. Cifrado en tránsito y reposo, gestión de secretos y copias cifradas.
7. Registro de accesos y cambios sin contenido sensible en logs.
8. Política para menores, terceros mencionados y datos de salud, religión o política.

## Recreaciones futuras

Clonar una voz o representar a una persona fallecida no es una función automática de una biografía.
Requiere consentimiento específico para cada modalidad y finalidad. Además:

- la experiencia debe mostrar permanentemente que es una simulación;
- una persona responsable debe poder suspenderla o revocar el permiso;
- las respuestas generadas no pueden presentarse como palabras reales del protagonista;
- se deben separar fuentes originales, inferencias y contenido sintético;
- toda interacción debe dejar trazabilidad accesible;
- no se usará para decisiones médicas, legales, financieras ni para suplantación.

La estructura de datos reserva estas garantías, pero la IA generativa permanece desactivada hasta que
existan controles técnicos, legales y de producto suficientes.

## Amenazas prioritarias

| Riesgo | Control previsto |
|---|---|
| Acceso indebido | mínimo privilegio, MFA, autorización por recurso y sesiones revocables |
| Borrado o sabotaje | auditoría inmutable, versiones, copias verificadas y restauración probada |
| Filtración de medios | URLs firmadas, análisis, cifrado y separación por propietario |
| Suplantación | revisión de reclamaciones, etiquetado sintético y registro de generación |
| Acoso por mensajes | solicitudes previas, bloqueo, denuncia, límites de tasa y moderación |
| Inyección o abuso | validación, límites de tamaño, CSP y consultas parametrizadas |
| Dependencias comprometidas | lockfiles, Dependabot, CI y revisión de actualizaciones |
