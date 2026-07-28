# MindSage

> Un archivo vivo para conservar historias, voces, recuerdos y sabiduría entre generaciones.

MindSage transforma entrevistas, fotografías, audios, vídeos, documentos y relaciones familiares en
biografías estructuradas. La aplicación está pensada para que cualquier persona pueda entrevistar a
sus familiares, reconstruir su historia y conservarla con consentimiento.

## Demostración funcional

[Abrir MindSage en GitHub Pages](https://alejandropico.github.io/Biografias/)

Sin iniciar sesión se pueden explorar los perfiles y contenidos marcados como públicos. Al pulsar
**Crear cuenta**, cualquier nombre, correo y contraseña válidos crean una identidad exclusivamente
local para probar:

- ficha propia y fichas de familiares, vivan o no;
- datos biográficos públicos y datos restringidos separados;
- relaciones familiares y perfiles incompletos para personas mencionadas;
- microeditor del árbol genealógico;
- cronología, residencias, migraciones, sabiduría y recuerdos;
- entrevistas guiadas con notas, transcripción y grabación real desde el micrófono;
- biblioteca de imágenes, audio, vídeo y documentos;
- mensajes locales vinculados a personas;
- atlas interactivo con recorridos vitales;
- exportación privada o pública e importación de copias JSON.

Los metadatos se guardan en `localStorage` y los archivos binarios en `IndexedDB`. Por eso sobreviven
a una recarga en el mismo navegador, pero no se sincronizan entre dispositivos. Borrar los datos del
sitio también borra este archivo local.

> **No introduzcas DNI, número de la Seguridad Social, teléfono, grabaciones privadas ni otros datos
> reales en la demo.** El registro, el inicio de sesión y la mensajería de GitHub Pages son una
> simulación local; no constituyen autenticación ni cifrado de servidor.

## Arquitectura

```text
apps/
├── api/   Spring Boot 4 · Java 25 LTS · SQLite/PostgreSQL · Flyway
└── web/   Angular 22 · TypeScript 6 · PWA · Capacitor 8
tools/     Verificación reproducible del esquema con Python
docs/      Arquitectura, contrato de producción, privacidad y hoja de ruta
```

La versión actual combina una aplicación local-first desplegable en GitHub Pages con una API pública
de consulta. La futura versión multiusuario reutilizará la interfaz, pero trasladará identidad,
permisos, mensajes y metadatos a PostgreSQL, y los medios a almacenamiento de objetos. SQLite queda
reservado para desarrollo y usos locales de una sola instancia.

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

Cada actualización de `main` ejecuta las pruebas web, API y SQLite, y publica la PWA mediante GitHub
Actions.

## Principios

- consentimiento explícito, granular, revocable y auditable;
- privacidad por defecto y mínimos privilegios;
- procedencia para distinguir memoria, interpretación y hechos contrastados;
- exportación y portabilidad;
- perfiles mencionados no equivalen a identidades verificadas;
- cualquier recreación futura de voz, imagen o personalidad permanece desactivada sin autorización
  específica y siempre debe identificarse como simulación.

## Documentación

- [Arquitectura](docs/ARCHITECTURE.md)
- [Contrato de la versión multiusuario](docs/PRODUCTION_CONTRACT.md)
- [Modelo de datos](docs/DATA_MODEL.md)
- [Privacidad e IA](docs/PRIVACY_AND_AI.md)
- [Hoja de ruta](docs/ROADMAP.md)
- [Política de seguridad](SECURITY.md)
- [Cómo contribuir](CONTRIBUTING.md)

## Autor y recursos de terceros

Proyecto de [Alejandro Pico Pérez](https://alejandropico.github.io/Portfolio/).

El árbol multicolor con raíces es un diseño original creado para MindSage. Su
[favicon SVG reutilizable](favicon.svg) está disponible en la raíz para enlazarlo desde el portfolio
u otros proyectos. El atlas usa [Leaflet](https://leafletjs.com/) y teselas de
[OpenStreetMap](https://www.openstreetmap.org/copyright), con atribución visible en el mapa.

Licencia del proyecto: [MIT](LICENSE).
