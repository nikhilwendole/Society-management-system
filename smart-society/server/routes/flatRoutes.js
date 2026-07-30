const express = require("express");
const { getFlats, createFlat, updateFlat, deleteFlat } = require("../controllers/flatController");
const { protect, authorize } = require("../middlewares/authMiddleware");

const router = express.Router();

router.use(protect, authorize("admin"));

router.route("/").get(getFlats).post(createFlat);
router.route("/:id").put(updateFlat).delete(deleteFlat);

module.exports = router;
