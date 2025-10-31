const express = require("express");
const app = express();
const authRoute = require("./routes/authRoute");



require("dotenv").config();

app.use(express.json());
app.use(express.static("public"));





app.use("/auth", authRoute);


app.listen(5000, () => {
  console.log("Server is running on port http://localhost:5000");
});
