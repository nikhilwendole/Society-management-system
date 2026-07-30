const express = require("express");
const { getNotices, createNotice, updateNotice, deleteNotice } = require("../controllers/noticeController");
const { protect, authorize } = require("../middlewares/authMiddleware");

const router = express.Router();

router.use(protect);

router.route("/").get(getNotices).post(authorize("admin"), createNotice);
router.route("/:id").put(authorize("admin"), updateNotice).delete(authorize("admin"), deleteNotice);

module.exports = router;
