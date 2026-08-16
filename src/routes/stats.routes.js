const express = require("express");
const { getUrlStats } = require("../controllers/stats.controller");
const { asyncHandler } = require("../middleware/asyncHandler");

const router = express.Router();

router.get("/:shortCode", asyncHandler(getUrlStats));

module.exports = router;
