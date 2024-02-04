declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production';
    PORT?: string;
    BOT_TOKEN: string;
    BOT_URL?: string;
    DATABASE_URL: string;
    GOOGLE_APPLICATION_CREDENTIALS?: string;
    GOOGLE_SHEETS_API_KEY?: string;
    COMPLAINT_TABLE_GOOGLE_SPREADSHEET_ID?: string;
    COMPLAINT_TABLE_GOOGLE_SHEET_RANGE?: string;
  }
}
