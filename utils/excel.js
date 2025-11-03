const XLSX = require("xlsx");
const path = require("path");
const fs = require("fs");



function readExcelToJson(filePath) {
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  return XLSX.utils.sheet_to_json(sheet);
}


function exportFailedRows(failedRows) {
  const ws = XLSX.utils.json_to_sheet(failedRows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "FailedRows");
  let folder = `uploads/productFailed`
  if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });
  const outputPath = `uploads/productFailed/failed_rows_${Date.now()}.xlsx`;
  XLSX.writeFile(wb, outputPath);
  return outputPath;
}

module.exports = {readExcelToJson,exportFailedRows}