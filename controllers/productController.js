const knex = require("../db/knexConfig");
const {
  SucessResponse,
  ErrorResponse,
  responsesMessages,
} = require("../utils/responses");
const _ = require('lodash');
const fs = require("fs");
const XLSX = require("xlsx");

//slug creator
function createSlug(name) {
  return _.kebabCase(name);  
}
const {exportFailedRows,readExcelToJson} = require('../utils/excel')


//create product
const createProduct = async (req, res) => {
  try {
    const data = req.body;
    data.slug = createSlug(`${data.name} ${data.brand}`)
    const [newProduct] = await knex("products").insert(data);

    SucessResponse(
      res,
      { id: newProduct, ...data },
      responsesMessages.PRODUCT_CREATED
    );
  } catch (error) {
    console.error("Error creating product:", error);
    if (error.code === "ER_DUP_ENTRY") {
      return ErrorResponse(res, "Product with this name already exists", 400);
    }
    ErrorResponse(res, responsesMessages.ISE, 500);
  }
};


//update product by id
const updateProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    data.updated_at = knex.fn.now();

    const updated = await knex("products").where({ id }).update(data);
    if (!updated) {
      ErrorResponse(res, "Product not found", 404);
      return;
    }
    const updatedProduct = await knex("products").where({ id }).first();
    SucessResponse(res, updatedProduct, responsesMessages.PRODUCT_UPDATED);
  } catch (error) {
    console.error("Error updating product:", error);
    ErrorResponse(res, responsesMessages.ISE, 500);
  }
};



//delete product by id
const deleteProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const deleted = await knex("products").update({is_delete:false}).where({ id });
    if (!deleted) {
      ErrorResponse(res, "Product not found", 404);
      return;
    }
    SucessResponse(res, deleted, responsesMessages.PRODUCT_DELETED);
  } catch (error) {
    console.error("Error deleting product:", error);
    ErrorResponse(res, responsesMessages.ISE, 500);
  }
};


//get all product details
const  getAllProducts = async(req,res)=>{
  try {
    const data = await knex('products').select('*')
    res.status(200).json({data})
    
  } catch (error) {
    res.status(400).json({success:"failed",message:error.message})
    
  }
}



//get product by id
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const get = await knex("products").where({ id }).first();
    if (!get) {
      ErrorResponse(res, "Product not found", 404);
      return;
    }
    SucessResponse(res, get, responsesMessages.PRODUCT_SHOWN);
  } catch (error) {
    console.error("Error got product:", error);
    ErrorResponse(res, "Internal server error", 500);
  }
};



//bulk upload
const bulkupload = async (req, res) => {
  try {
    // --- Setup SSE headers ---
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const filePath = req.file.path;
    const jsonData = readExcelToJson(filePath);
    const chunkSize = 500;
    const total = jsonData.length;
    let processed = 0;
    const failedRows = [];

    // --- Split data into chunks (no loops) ---
    const chunks = Array.from(
      { length: Math.ceil(total / chunkSize) },
      (_, i) => jsonData.slice(i * chunkSize, (i + 1) * chunkSize)
    );

    // --- Chunk processor (returns Promise) ---
    const processChunk = async (chunk) =>
      Promise.allSettled(
        chunk.map(async (row) => {
          try {
            await knex("products").insert(row);
            processed++;

            const progress = Math.round((processed / total) * 100);

            // ✅ Send progress as SSE message
            res.write(`data: Progress: ${progress}% (${processed}/${total})\n\n`);
            console.log(`Progress: ${progress}% (${processed}/${total})`);
          } catch (err) {
           
            console.error("❌ Failed insert:", row.name, "Reason:",responsesMessages[err.code]  );
            failedRows.push({ ...row, error: responsesMessages[err.code] });
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
      const failedFile = exportFailedRows(failedRows);
      res.write(`data: ${JSON.stringify({failedFile,data:`✅ ${processed} inserted successfully.`,failedRows:failedRows.length,failedData:failedRows})}\n\n`);
      res.end();
      return;
    }

    // --- Final success message ---
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
            await knex("products").where("name", row.name).update(row);
            processed++;
            const progress = Math.round((processed / total) * 100);
            res.write(`data: Progress: ${progress}% (${processed}/${total})\n\n`);
            console.log(`Progress: ${progress}% (${processed}/${total})`);
          } catch (err) {
            console.error("❌ Failed insert:", row.name, "Reason:",responsesMessages[err.code]  );
            failedRows.push({ ...row, error: responsesMessages[err.code] });
          }
        })
      );

    await chunks.reduce(
      (chain, chunk) => chain.then(() => processChunk(chunk)),
      Promise.resolve()
    );

    console.log(failedRows)
    if (failedRows.length > 0) {
      const failedFile = exportFailedRows(failedRows);
      res.write(`data: ${JSON.stringify({failedFile,data:`✅ ${processed} inserted successfully.`,failedRows:failedRows.length,failedData:failedRows})}\n\n`);
      res.end();
      return;
    }

    //  res.write(
    //   `data: ✅ ${JSON.stringify({
    //     message: `${processed} records inserted successfully`,
    //   })}\n\n`
    // );
    
   
   res.write(`data: ✅ ${processed} rows updated successfully.\n\n`);
    res.write("data: Updated completed!\n\n");
    res.end();
  } catch (err) {
    console.error("❌ Insert Error:", err.message);
    res.write(`data: Error: ${err.message}\n\n`);
    res.end();
  }
};


const  getBulkData = async (req, res) => {
  try {
    // 1️⃣ Get all data from DB
    const data = await knex("products").select("*");

    if (!data || data.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No product data found to export.",
      });
    }

    // 2️⃣ Convert JSON → Excel Sheet
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Products");

    // 3️⃣ Ensure folder exists
    const folder = "uploads/exportedProducts";
    if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });

    // 4️⃣ Create unique file name
    const filePath = `${folder}/products_${Date.now()}.xlsx`;

    // 5️⃣ Write file
    XLSX.writeFile(wb, filePath);

    // 6️⃣ Send success response
    res.status(200).json({
      success: true,
      message: "All products exported successfully.",
      file: filePath,
    });
  } catch (err) {
    console.error("❌ Export Error:", err.message);
    res.status(500).json({
      success: false,
      message: "Failed to export products.",
      error: err.message,
    });
  }
};

module.exports = {
  createProduct,
  updateProductById,
  deleteProductById,
  getProductById,
  getAllProducts,
  getBulkData,
  bulkupload,
  bulkUpdate
};
