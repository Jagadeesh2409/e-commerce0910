const knex = require("../db/knexConfig");
const { readExcelToJson, exportFailedRows } = require("../utils/excel");
const { responsesMessages } = require("../utils/responses");
const XLSX = require("xlsx");
const path = require("path");
const fs = require("fs");


const bulkupload = async (req, res) => {
  try {
    const tableName = req.params.table; // 👉 e.g. /bulkupload/products or /bulkupload/orders
    if (!["products", "orders"].includes(tableName)) {
      return res.status(400).json({ message: "Invalid table name" });
    }

    // --- SSE setup ---
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const filePath = req.file.path;
    const jsonData = readExcelToJson(filePath);
    const chunkSize = 500;
    const total = jsonData.length;
    let processed = 0;
    const failedRows = [];

    const chunks = Array.from(
      { length: Math.ceil(total / chunkSize) },
      (_, i) => jsonData.slice(i * chunkSize, (i + 1) * chunkSize)
    );

    const processChunk = async (chunk) =>
      Promise.allSettled(
        chunk.map(async (row) => {
          try {
            await knex(tableName).insert(row);
            processed++;
            const progress = Math.round((processed / total) * 100);
            res.write(`data: Progress: ${progress}% (${processed}/${total})\n\n`);
          } catch (err) {
            console.log(err)
            failedRows.push({ ...row, error: responsesMessages[err.code] || err.message });
          }
        })
      );
      

    await chunks.reduce(
      (chain, chunk) => chain.then(() => processChunk(chunk)),
      Promise.resolve()
    );

  

    if (failedRows.length > 0) {
      const failedFile = exportFailedRows(failedRows,tableName);
      res.write(`data: ${JSON.stringify({ 
        failedFile, 
        data: `✅ ${processed} inserted successfully.`,
        failedRows: failedRows.length 
      })}\n\n`);
      res.end();
      return;
    }

    res.write(`data: ✅ ${processed} rows inserted successfully.\n\n`);
    res.write("data: Upload completed!\n\n");
    res.end();
  } catch (err) {
    console.error("❌ Insert Error:", err.message);
    res.write(`data: Error: ${err.message}\n\n`);
    res.end();
  }
};



const bulkUpdate = async (req, res) => {
  try {
    const tableName = req.params.table;
    if (!["products", "orders"].includes(tableName)) {
      return res.status(400).json({ message: "Invalid table name" });
    }

    const updateKey = tableName === "products" ? "name" : "invoice";

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const filePath = req.file.path;
    const jsonData = readExcelToJson(filePath);
    const chunkSize = 500;
    const total = jsonData.length;
    let processed = 0;
    const failedRows = [];

    const chunks = Array.from(
      { length: Math.ceil(total / chunkSize) },
      (_, i) => jsonData.slice(i * chunkSize, (i + 1) * chunkSize)
    );

    // --- Process each chunk ---
    const processChunk = async (chunk) =>
      Promise.allSettled(
        chunk.map(async (row) => {
          try {
            // ✅ Dynamic WHERE condition
            await knex(tableName).where(updateKey, row[updateKey]).update(row);
            processed++;

            const progress = Math.round((processed / total) * 100);
            res.write(`data: Progress: ${progress}% (${processed}/${total})\n\n`);
          } catch (err) {
            console.error(`❌ Failed update for ${row[updateKey]}:`, err.message);
            failedRows.push({ ...row, error: responsesMessages[err.code] || err.message });
          }
        })
      );

    // --- Sequentially process chunks ---
    await chunks.reduce(
      (chain, chunk) => chain.then(() => processChunk(chunk)),
      Promise.resolve()
    );

    // --- Handle failed rows ---
    if (failedRows.length > 0) {
      const failedFile = exportFailedRows(failedRows,tableName);
      res.write(`data: ${JSON.stringify({
        failedFile,
        data: `✅ ${processed} rows updated successfully.`,
        failedRows: failedRows.length,
      })}\n\n`);
      res.end();
      return;
    }

    res.write(`data: ✅ ${processed} rows updated successfully.\n\n`);
    res.write("data: Update completed!\n\n");
    res.end();
  } catch (err) {
    console.error("❌ Update Error:", err.message);
    res.write(`data: Error: ${err.message}\n\n`);
    res.end();
  }
};


const getBulkData = async (req, res) => {
  try {
    const tableName = req.params.table;
    if (!["products", "orders"].includes(tableName)) {
      return res.status(400).json({ message: "Invalid table name" });
    }
    
    const data = await knex(tableName).select("*");

    if (!data || data.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No ${tableName} data found to export.`,
      });
    }

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, tableName);

    const folder = `uploads/exported_${tableName}`;
    if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });

    const filePath = `${folder}/${tableName}_${Date.now()}.xlsx`;
    XLSX.writeFile(wb, filePath);

    res.status(200).json({
      success: true,
      message: `${tableName} exported successfully.`,
      file: filePath,
    });
  } catch (err) {
    console.error("❌ Export Error:", err.message);
    res.status(500).json({
      success: false,
      message: `Failed to export ${req.params.table}.`,
      error: err.message,
    });
  }
};


module.exports = {bulkUpdate,bulkupload,getBulkData}



