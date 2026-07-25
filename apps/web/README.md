# MindSage Web

Cliente Angular de MindSage. Funciona como web adaptable, PWA instalable y fuente del paquete móvil
Capacitor.

```bash
npm ci
npm start
npm test
npm run build
```

Para generar los proyectos nativos por primera vez:

```bash
npx cap add android
npx cap add ios
npm run mobile:sync
```

Android requiere Android Studio. iOS requiere macOS y Xcode. Las carpetas nativas no se versionan
todavía para evitar código generado hasta configurar identificadores, firma y metadatos definitivos.

