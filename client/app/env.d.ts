declare namespace NodeJS {
  export interface ProcessEnv {
    BACKEND_ENDPOINT: string;
    SESSION_SECRET: string;
  }
}
