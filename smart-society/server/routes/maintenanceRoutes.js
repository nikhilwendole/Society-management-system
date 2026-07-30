const express = require("express");
const { createBill, getBills, markPaid } = require("../controllers/maintenanceController");
const { protect, authorize } = require("../middlewares/authMiddleware");

const router = express.Router();

router.use(protect);

router.route("/").get(getBills).post(authorize("admin"), createBill);
router.put("/:id/pay", authorize("admin"), markPaid);

module.exports = router;
