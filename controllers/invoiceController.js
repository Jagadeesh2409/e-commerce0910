const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const knex = require("../db/knexConfig");

const generateInvoice = async (req, res) => {
  const { order_id } = req.params;
  const user_id = req.user.id;

  try {
    const order = await knex("orders").where({ id: order_id, user_id }).first();

    if (!order) return res.status(404).json({ message: "Order not found" });

    const invoiceNumber =
      order.invoice_no || `INV-${new Date().getFullYear()}-${order_id}`;

    const orderItems = await knex("order_items")
      .join("products", "order_items.product_id", "products.id")
      .select(
        "products.name",
        "order_items.quantity",
        "order_items.price",
        "order_items.discount",
        "order_items.tax",
        "order_items.total"
      )
      .where("order_items.order_id", order_id);

    const doc = new PDFDocument({ margin: 50 });
    const invoicesDir = path.join(__dirname, "../invoices");
    if (!fs.existsSync(invoicesDir)) fs.mkdirSync(invoicesDir);

    const invoicePath = path.join(invoicesDir, `${invoiceNumber}.pdf`);
    doc.pipe(fs.createWriteStream(invoicePath));

    doc.fontSize(20).text("INVOICE", { align: "center" }).moveDown();

    doc
      .fontSize(12)
      .text(`Invoice No: ${invoiceNumber}`)
      .text(`Date: ${new Date(order.created_at).toLocaleDateString()}`)
      .moveDown();

    doc.text("From: Gnxtace Pvt Ltd");
    doc.text(`To: Customer ID ${user_id}`);
    doc.text(`Order ID: ${order_id}`).moveDown();

    doc.fontSize(12);
    doc
      .text("Product", 50)
      .text("Qty", 250)
      .text("Price", 320)
      .text("Total", 420);
    doc
      .moveTo(50, doc.y + 5)
      .lineTo(550, doc.y + 5)
      .stroke();

    let subtotal = 0;
    orderItems.forEach((item) => {
      subtotal += parseFloat(item.total_price);

      doc
        .moveDown(0.5)
        .text(item.name, 50)
        .text(item.quantity, 250)
        .text(item.price, 320)
        .text(item.total_price, 420);
    });

    doc.moveDown(2);
    doc.text(`Subtotal: ₹${subtotal}`, { align: "right" });
    doc.text(`Tax: ₹${(order.tax || 0)}`, { align: "right" });
    doc.text(`Discount: ₹${(order.discount || 0)}`, {
      align: "right",
    });
    doc.text(`Grand Total: ₹${(order.total_price || 0)}`, {
      align: "right",
    });

    doc.moveDown(3);
    doc.fontSize(10).text("Thank you for your purchase!", { align: "center" });

    doc.end();

    res.json({
      message: "Invoice generated successfully",
      invoice_no: invoiceNumber,
      file_path: `/invoices/${invoiceNumber}.pdf`,
    });
  } catch (error) {
    console.error("Invoice Generation Error:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { generateInvoice };
