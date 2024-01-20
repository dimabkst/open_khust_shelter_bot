declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production';
    PORT?: string;
    BOT_TOKEN: string;
    BOT_URL?: string;
  }
}
