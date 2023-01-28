declare namespace NodeJS {
  export interface ProcessEnv {
    BACKEND_ENDPOINT: string;
    CLOUDINARY_KEY: string;
    CLOUDINARY_SECRET: string;
    CLOUDINARY_URL: string;
    SESSION_SECRET: string;
  }
}
