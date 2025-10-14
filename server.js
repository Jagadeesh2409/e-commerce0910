const express = require("express");
const app = express();
const authRoute = require("./routes/authRoute");
const unitRoute = require("./routes/unitRoute");
const productRoute = require("./routes/productRoute");
const categoryRoute = require("./routes/categoryRoute");
const cartRouter = require("./routes/cartRoute");

app.use(express.json());
app.use("/api/auth", authRoute);
app.use("/api/units", unitRoute);
app.use("/api/products", productRoute);
app.use("/api/categories", categoryRoute);
app.use("/api/cart", cartRouter);

app.listen(3000, () => {
  console.log("Server is running on port http://localhost:3000");
});
