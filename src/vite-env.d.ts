/// <reference types="vite/client" />

declare module '*.mp3';

interface ImportMetaEnv {
  readonly X_FIREBASE_API_KEY: string;
  readonly X_FIREBASE_AUTH_DOMAIN: string;
  readonly X_FIREBASE_PROJECT_ID: string;
  readonly X_FIREBASE_STORAGE: string;
  readonly X_FIREBASE_MESSAGING: string;
  readonly X_FIREBASE_APP_ID: string;
  readonly X_FIREBASE_MEASUREMENT_ID: string;
  readonly X_FIREBASE_DATABASE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
