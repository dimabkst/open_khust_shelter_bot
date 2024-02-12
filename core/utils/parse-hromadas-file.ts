import fs from 'fs/promises';
import path from 'path';
import XLSX, { read } from 'xlsx';

const fileDirectory = path.join(__dirname, '../../assets/static/data/hromadas.xls');

const parseHromadasFile = async () => {
  const workbookBuffer = await fs.readFile(fileDirectory);

  const workbook = read(workbookBuffer);

  const sheetName = workbook.SheetNames[0];

  const sheet = workbook.Sheets[sheetName];

  // Decode the range to get the number of rows and columns
  const range = XLSX.utils.decode_range(sheet['!ref']);
  const numRows = range.e.r + 1; // Adding 1 because row indices are zero-based
  const numCols = range.e.c + 1; // Adding 1 because column indices are zero-based

  const settlementsByHromadas: Record<string, string[]> = {};

  let lastHromada: string;

  for (let row = 0; row < numRows; row++) {
    for (let column = 0; column < numCols; column++) {
      const cellRef = XLSX.utils.encode_cell({ c: column, r: row });

      const cellValue = sheet[cellRef]?.v;

      if (column === 0 && cellValue) {
        settlementsByHromadas[cellValue] = [];

        lastHromada = cellValue;
      } else if (cellValue) {
        settlementsByHromadas[lastHromada].push(cellValue);
      }
    }
  }

  return settlementsByHromadas;
};

export default parseHromadasFile;
