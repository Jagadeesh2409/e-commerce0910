const express = require("express");
require("dotenv").config();

const app = express();

const authRoute = require("./routes/authRoute");
const unitRoute = require("./routes/unitRoute");
const productRoute = require("./routes/productRoute");
const categoryRoute = require("./routes/categoryRoute");
const cartRouter = require("./routes/cartRoute");
const pincodeRoute = require("./routes/pincodeRoute");
const addressRoute = require("./routes/addressRoute");
const orderRoute = require("./routes/orderRoute");
const paymentRoute = require("./routes/paymentRoute");
const checkoutRoute = require("./routes/checkoutRoute");
const deliveryRoutes = require("./routes/deliveryRoute");
const invoiceRoutes = require("./routes/invoiceRoute");
const uploadRoute = require("./routes/uploadRoute");


app.use("/api/auth", authRoute);
app.use("/api/units", unitRoute);
app.use("/api/products", productRoute);
app.use("/api/categories", categoryRoute);
app.use("/api/cart", cartRouter);
app.use("/api/pincode", pincodeRoute);
app.use("/api/address", addressRoute);
app.use("/api/order", orderRoute);
app.use("/api/payment", paymentRoute);
app.use("/api/checkout", checkoutRoute);
app.use("/api/delivery", deliveryRoutes);
app.use("/api/invoice", invoiceRoutes);
app.use("/api/upload", uploadRoute);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
