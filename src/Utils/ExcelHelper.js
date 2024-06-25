import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

export const updateExcelFile = async (formData) => {
  const url = 'path_to_your_existing_excel_file.xlsx'; // Update with your file path
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();

  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(arrayBuffer);

  const worksheet = workbook.getWorksheet(1);

  // Assuming you want to add a new row with the form data
  const newRow = worksheet.addRow(Object.values(formData));
  newRow.commit();

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, 'updated_excel_file.xlsx');
};
