const express = require("express");
const app = express();
const authRoute = require("./routes/authRoute");

app.use(express.json());
app.use("/api/auth", authRoute);

app.listen(3000, () => {
  console.log("Server is running on port http://localhost:3000");
});
