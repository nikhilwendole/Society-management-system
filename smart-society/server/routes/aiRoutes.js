const express = require("express");
const {
  complaintAssistant,
  noticeGenerator,
  societyChatbot,
  meetingSummary,
} = require("../controllers/aiController");
const { protect, authorize } = require("../middlewares/authMiddleware");

const router = express.Router();

router.use(protect);

router.post("/complaint-assistant", authorize("member"), complaintAssistant);
router.post("/notice-generator", authorize("admin"), noticeGenerator);
router.post("/chatbot", societyChatbot);
router.post("/meeting-summary", authorize("admin"), meetingSummary);

module.exports = router;
