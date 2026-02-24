const express = require("express");
const cors = require("cors");
const authRoutes = require('./routes/authRoutes')
const repoRoutes = require('./routes/repoRoutes')
const cookieParser = require("cookie-parser");

const app = express();

app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  }));
app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api", repoRoutes);

module.exports = app;