const express = require("express");
const {
  createVisitor,
  getVisitors,
  updateApprovalStatus,
  markEntry,
  markExit,
} = require("../controllers/visitorController");
const { protect, authorize } = require("../middlewares/authMiddleware");

const router = express.Router();

router.use(protect);

router.route("/").get(getVisitors).post(authorize("member"), createVisitor);
router.put("/:id/approval", authorize("admin"), updateApprovalStatus);
router.put("/:id/entry", authorize("guard"), markEntry);
router.put("/:id/exit", authorize("guard"), markExit);

module.exports = router;
