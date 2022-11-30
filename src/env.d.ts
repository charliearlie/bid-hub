declare namespace NodeJS {
  export interface ProcessEnv {
    DATABASE_NAME: string;
    DATABASE_USER: string;
    DATABASE_PASSWORD: string;
    SESSION_SECRET: string;
    CORS_ORIGIN: string;
  }
}
