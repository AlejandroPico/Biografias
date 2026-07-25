import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'dev.mindsage.app',
  appName: 'MindSage',
  webDir: 'dist/web/browser',
  server: {
    androidScheme: 'https',
  },
};

export default config;
