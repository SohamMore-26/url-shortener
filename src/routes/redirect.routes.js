const express = require("express");
const { redirectToLongUrl } = require("../controllers/redirect.controller");
const { asyncHandler } = require("../middleware/asyncHandler");

const router = express.Router();

router.get("/:shortCode", asyncHandler(redirectToLongUrl));

module.exports = router;
