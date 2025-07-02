import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.75e26c4342d94b53a90e1ce8e4a1685b',
  appName: 'A Lovable project',
  webDir: 'dist',
  server: {
    url: 'https://75e26c43-42d9-4b53-a90e-1ce8e4a1685b.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    Camera: {
      permissions: ['camera', 'microphone']
    }
  }
};

export default config;