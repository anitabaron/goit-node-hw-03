const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

const uriDb = process.env.MONGO_URI;
mongoose
  .connect(uriDb)
  .then(() => console.log("Database connection successful"))
  .catch((err) => {
    console.error("Database connection error:", err);
    process.exit(1);
  });

const contactsRouter = require("./routes/api/contacts");
app.use("/api/contacts", contactsRouter);

const formatsLogger = app.get("env") === "development" ? "dev" : "short";
app.use(logger(formatsLogger));

app.use(cors());
app.use(express.json());

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message, data: "Internal Server Error" });
});

module.exports = app;
