const express = require("express");

require("dotenv").config();

const shortenRoutes = require("./routes/shorten.routes");
const redirectRoutes = require("./routes/redirect.routes");
const statsRoutes = require("./routes/stats.routes");
const { errorHandler } = require("./middleware/errorHandler");

const app = express();

app.use(express.json());

app.use("/api/shorten", shortenRoutes);
app.use("/api/stats", statsRoutes);
app.use("/", redirectRoutes);

app.use(errorHandler);

module.exports = app;
