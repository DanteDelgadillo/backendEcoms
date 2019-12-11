const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const cors = require("cors");
const multer = require('multer');
const path = require('path');

const users = require("./Routes/api/users");
// const stock = require("./Routes/api/stock");

const app = express();

//bodyParser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
// image storage location 

const storage = multer.diskStorage({
  destination: path.join(__dirname, "public/uploads"),
  filename: (req, file, cb) => {
    cb(null, new Date().getTime() + path.extname(file.originalname));
  }
})
app.use(multer({ storage }).single("file"));

//db Config
const db = require("./config/keys").mongoURL;




//Connect to mongodb
mongoose
  .connect(process.env.MONGODB_URL, { useNewUrlParser: true })
  .then(() => console.log("mongoDb connected"))
  .catch(err => console.log(err));

//Passport middleware
app.use(passport.initialize());

//Passport Config
require("./config/passport")(passport);

// use Routes
// app.use("/api/users", users);
// app.use("/api/stock", stock);
app.use(require("./Routes/api/users"))
app.use(require("./Routes/api/stock"))
const port = process.env.PORT || 3001;

app.listen(port, () => console.log(`Server running on port ${port}`));
