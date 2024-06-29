const express = require("express");
const path = require("path");
const helmet = require("helmet");
const cors = require("cors");
const logger = require("./middlewares/logger");
const { errorHandler, notFound } = require("./middlewares/errors");
require("dotenv").config();
const connectToDB = require("./config/db");

//connection to data base
connectToDB();

//init app
const app = express();

//statique folder
app.use(express.static(path.join(__dirname, "images")));

//Apply middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(logger);

//set helmet
app.use(helmet());

//set cors policy
app.use(cors({
  origin:"http://localhost:3000"
}));

//set view engine
app.set("view engine", "ejs");

//Routes
app.use("/api/books", require("./routes/books"));
app.use("/api/authors", require("./routes/authors"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/users"));
app.use("/api/upload", require("./routes/upload"));
app.use("/password", require("./routes/password"));

// error handler middleware
app.use(notFound);
app.use(errorHandler);

//Running the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () =>
  console.log(
    `the server is running in ${process.env.NODE_ENV} mode on PORT ${PORT}`
  )
);
