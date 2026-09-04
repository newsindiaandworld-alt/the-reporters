import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.thereporters.app',
  appName: 'The Reporters',
  webDir: 'public',
  server: {
    url: 'https://the-reporters.vercel.app',
    cleartext: true
  }
};

export default config;
