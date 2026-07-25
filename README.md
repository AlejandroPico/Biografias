# MindSage

> Un archivo vivo para conservar historias, voces, recuerdos y sabiduría entre generaciones.

MindSage transforma entrevistas, fotografías, audios, vídeos y documentos familiares en biografías
estructuradas que una familia puede preservar, explorar y compartir con consentimiento.

Esta primera fundación reemplaza el prototipo original por una arquitectura web, móvil y API preparada
para crecer sin perder de vista lo esencial: las personas son dueñas de su historia.

## Ya se puede probar

La aplicación web incluye una demostración navegable con:

- archivo de personas y perfiles biográficos;
- cronología vital, sabiduría, árbol familiar y atlas de migraciones;
- estudio de entrevista con preguntas guiadas y grabación simulada;
- borradores privados guardados en el navegador y exportación JSON;
- modo claro/oscuro, diseño adaptable y PWA instalable;
- experiencia móvil preparada para empaquetarse con Capacitor.

Los datos de la demostración son ficticios. GitHub Pages publicará automáticamente la web al integrar
los cambios en `main`.

## Arquitectura

```text
apps/
├── api/   Spring Boot 4 · Java 25 LTS · SQLite/PostgreSQL · Flyway
└── web/   Angular 22 · TypeScript 6 · PWA · Capacitor 8
tools/     Verificación reproducible del esquema con Python
docs/      Arquitectura, modelo de datos, privacidad y hoja de ruta
```

La web de demostración funciona por sí sola en GitHub Pages. La API ofrece inicialmente consultas
públicas de solo lectura y mantiene bloqueadas las operaciones no implementadas. SQLite permite
desarrollo local sin infraestructura; PostgreSQL es el destino previsto para producción.

## Puesta en marcha

### Web

Requisitos: Node.js 24.15 o posterior y npm 11.

```bash
cd apps/web
npm ci
npm start
```

Abre `http://localhost:4200`.

### API

Requisitos: Java 25 LTS. El wrapper descarga Gradle 9.6.1.

```bash
./gradlew :apps:api:bootRun
```

La API queda en `http://localhost:8080`; la salud se consulta en `/actuator/health`. En desarrollo
crea `data/mindsage.db` y ejecuta las migraciones automáticamente.

### Calidad

```bash
cd apps/web && npm test && npm run build
cd ../.. && ./gradlew :apps:api:test
python tools/validate_schema.py
```

## Principios del producto

- consentimiento explícito, granular, revocable y auditable;
- privacidad por defecto y mínimos privilegios;
- procedencia y citas para distinguir memoria, interpretación y hechos contrastados;
- exportación y portabilidad para evitar que una vida quede atrapada en una plataforma;
- cualquier recreación futura de voz, imagen o personalidad permanece desactivada sin autorización
  específica y debe identificarse siempre como simulación;
- diseño accesible para personas mayores, familias y entrevistadores.

## Documentación

- [Arquitectura](docs/ARCHITECTURE.md)
- [Modelo de datos](docs/DATA_MODEL.md)
- [Privacidad e IA](docs/PRIVACY_AND_AI.md)
- [Hoja de ruta](docs/ROADMAP.md)
- [Política de seguridad](SECURITY.md)
- [Cómo contribuir](CONTRIBUTING.md)

## Estado

MindSage está en fase fundacional. La interfaz pública es una demo funcional; autenticación,
subida real de medios, sincronización y publicación editorial forman parte de las siguientes etapas.
No se deben introducir datos personales reales hasta completar esas garantías.

Licencia: [MIT](LICENSE).
