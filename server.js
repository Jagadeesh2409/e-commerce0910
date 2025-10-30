const express = require("express");
const app = express();
const authRoute = require("./routes/authRoute");
const session = require("express-session");
const passport = require("passport")

app.use(express.json());
require('./config/passport')

app.use(session({
    secret:"secret",
    resave:false,
    saveUninitialized:true,
}))

app.use(passport.initialize())
app.use(passport.session())

app.use("/auth", authRoute);


app.listen(5000, () => {
  console.log("Server is running on port http://localhost:5000");
});
