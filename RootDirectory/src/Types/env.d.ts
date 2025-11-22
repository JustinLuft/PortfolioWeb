// env.d.ts
interface ImportMetaEnv {
  readonly VITE_GROQ_API_KEY: string;
  // add more environment variables here if needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
