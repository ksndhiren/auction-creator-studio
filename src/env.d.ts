/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      readonly SUPABASE_URL: string;
      readonly SUPABASE_SERVICE_ROLE_KEY: string;
      readonly SUPABASE_SECRET_KEY: string;
      readonly SUPABASE_STORAGE_BUCKET: string;
    }
  }
}

export {};
