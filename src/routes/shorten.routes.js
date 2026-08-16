const express = require("express");
const { shortenUrl } = require("../controllers/shorten.controller");
const { asyncHandler } = require("../middleware/asyncHandler");
const { validateUrl } = require("../middleware/validateUrl");

const router = express.Router();

router.post("/", validateUrl, asyncHandler(shortenUrl));

module.exports = router;
