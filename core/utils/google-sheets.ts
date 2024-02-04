import { google } from 'googleapis';
import { IValueRange } from './types';
import { HttpError } from './error';

const { GOOGLE_SHEETS_API_KEY, COMPLAINT_TABLE_GOOGLE_SPREADSHEET_ID, COMPLAINT_TABLE_GOOGLE_SHEET_RANGE } = process.env;

const sheets = google.sheets('v4');

export class GoogleSheetsProvider {
  private static API_KEY = GOOGLE_SHEETS_API_KEY;
  private static API_SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

  public static COMPLAINT_TABLE_SPREADSHEET_ID = COMPLAINT_TABLE_GOOGLE_SPREADSHEET_ID;
  public static COMPLAINT_TABLE_SHEET_RANGE = COMPLAINT_TABLE_GOOGLE_SHEET_RANGE;

  private async getAuth() {
    const auth = new google.auth.GoogleAuth({
      scopes: GoogleSheetsProvider.API_SCOPES,
    });

    return auth;
  }

  public async getSpreadsheet(spreadsheetId: string) {
    try {
      const auth = await this.getAuth();

      const res = await sheets.spreadsheets.get({ auth, key: GoogleSheetsProvider.API_KEY, spreadsheetId });

      return res?.data?.sheets;
    } catch (e) {
      if (e.response?.status) {
        throw new HttpError(e.response.status, e.response?.data?.message, e.response?.data);
      } else {
        throw e;
      }
    }
  }

  public async getSpreadsheetValues(spreadsheetId: string, sheetName: string) {
    try {
      const auth = await this.getAuth();

      const res = await sheets.spreadsheets.values.get({
        auth,
        key: GoogleSheetsProvider.API_KEY,
        spreadsheetId,
        range: sheetName,
      });

      return res?.data;
    } catch (e) {
      if (e.response?.status) {
        throw new HttpError(e.response.status, e.response?.data?.message, e.response?.data);
      } else {
        throw e;
      }
    }
  }

  public async appendValuesToSheet(spreadsheetId: string, sheetName: string, valueRange: IValueRange) {
    try {
      const auth = await this.getAuth();

      const res = await sheets.spreadsheets.values.append({
        auth,
        key: GoogleSheetsProvider.API_KEY,
        spreadsheetId,
        range: sheetName,
        valueInputOption: 'RAW',
        insertDataOption: 'INSERT_ROWS',
        requestBody: valueRange,
      });

      return res?.data;
    } catch (e) {
      if (e.response?.status) {
        throw new HttpError(e.response.status, e.response?.data?.message, e.response?.data);
      } else {
        throw e;
      }
    }
  }
}
