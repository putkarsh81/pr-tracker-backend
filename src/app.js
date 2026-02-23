const express = require("express");
const cors = require("cors");
const authRoutes = require('./routes/authRoutes')
const repoRoutes = require('./routes/repoRoutes')

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/api", repoRoutes);

module.exports = app;