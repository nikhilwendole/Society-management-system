const express = require("express");
const {
  createComplaint,
  getComplaints,
  getComplaintById,
  updateComplaintStatus,
  deleteComplaint,
} = require("../controllers/complaintController");
const { protect, authorize } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/upload");

const router = express.Router();

router.use(protect);

router.route("/").get(getComplaints).post(upload.single("image"), createComplaint);
router.get("/:id", getComplaintById);
router.put("/:id/status", authorize("admin"), updateComplaintStatus);
router.delete("/:id", authorize("admin"), deleteComplaint);

module.exports = router;
