import prisma from '../db';
import moment from 'moment-timezone';
import { IAppendComplaintInfoToTablePayload } from './types';
import { GoogleSheetsProvider } from '../utils/google-sheets';
import { IValueRange } from '../utils/types';
import { HttpError } from '../utils/error';
import { ComplaintReasonType } from '@prisma/client';

const appendComplaintInfoToTable = async (payload: IAppendComplaintInfoToTablePayload) => {
  const { complaintId } = payload;

  const complaint = await prisma.complaint.findUnique({
    where: {
      id: complaintId,
    },
    select: {
      createdAt: true,
      reason: true,
      reasonType: true,
      shelterName: true,
      settlement: {
        select: {
          name: true,
          hromada: {
            select: {
              name: true,
            },
          },
        },
      },
      complainant: {
        select: {
          username: true,
          fullName: true,
          phoneNumber: true,
        },
      },
    },
  });

  if (!complaint) {
    throw new HttpError(404, 'Complaint cannot be found');
  }

  const sheets = new GoogleSheetsProvider();

  const rows = await sheets.getSpreadsheetValues(
    GoogleSheetsProvider.COMPLAINT_TABLE_SPREADSHEET_ID,
    GoogleSheetsProvider.COMPLAINT_TABLE_SHEET_RANGE
  );

  const offset = moment.tz('Europe/Kiev').utcOffset();

  const data: IValueRange = {
    majorDimension: 'ROWS',
    values: [
      [
        rows?.values?.length ? rows.values.length + 1 : 1,
        complaint.complainant.username,
        complaint.complainant.fullName,
        moment(complaint.createdAt).utc().add(offset, 'minutes').format('DD.MM.YYYY, HH:mm'),
        `${complaint.shelterName}, ${complaint.settlement.name}, ${complaint.settlement.hromada.name} тг`,
        null, // TODO: add location when implemented
        complaint.complainant.phoneNumber,
        complaint.reasonType === ComplaintReasonType.CLOSED_SHELTER ? '+' : null,
        complaint.reasonType === ComplaintReasonType.NOT_ALLOWED_TO_ENTER ? '+' : null,
        complaint.reasonType === ComplaintReasonType.ABSENT_SHELTER ? '+' : null,
        complaint.reason,
      ],
    ],
  };

  const res = await sheets.appendValuesToSheet(
    GoogleSheetsProvider.COMPLAINT_TABLE_SPREADSHEET_ID,
    GoogleSheetsProvider.COMPLAINT_TABLE_SHEET_RANGE,
    data
  );

  if (!res?.updates?.updatedRows) {
    throw new HttpError(400, 'Complaint info was empty or not appended');
  }

  return res;
};

export default appendComplaintInfoToTable;
