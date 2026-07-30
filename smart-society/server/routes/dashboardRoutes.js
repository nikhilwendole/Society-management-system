const express = require("express");
const { getAdminStats } = require("../controllers/dashboardController");
const { protect, authorize } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/admin", protect, authorize("admin"), getAdminStats);

module.exports = router;
