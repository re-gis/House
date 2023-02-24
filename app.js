const express = require("express");
const router = require("./routes/users.Route");
const app = express();
const dotenv = require("dotenv").config();
const PORT = process.env.PORT;
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const fileUpload = require("express-fileupload");
const sessions = require("express-session");
const cookieParser = require("cookie-parser");
const { houseRouter } = require('./routes/house.routes')

// Using sessions
const oneDay = 1000 * 60 * 60 * 24;
app.use(
  sessions({
    secret: process.env.SECRET,
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    resave: false,
  })
);

// Uploading a file
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

// Cookie parser stuff
app.use(cookieParser());

// Database stuff
connectDB();

// Body parser stuff
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

// APIs
app.use("/api/v1/users", router);

app.use("/api/v1/house", houseRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}...`);
});
