const express = require("express");
const dotenv = require("dotenv").config();
const { connectDB } = require("../src/config/db");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
connectDB();

// Health Check
app.get("/health", (req, res) => {
  return res.send("Server is running fine");
});

module.exports = { app };
