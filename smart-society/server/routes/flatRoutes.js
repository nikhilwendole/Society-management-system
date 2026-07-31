// const express = require("express");
// const { getFlats, createFlat, updateFlat, deleteFlat } = require("../controllers/flatController");
// const { protect, authorize } = require("../middlewares/authMiddleware");

// const router = express.Router();

// router.use(protect, authorize("admin"));

// router.route("/").get(getFlats).post(createFlat);
// router.route("/:id").put(updateFlat).delete(deleteFlat);

// module.exports = router;




const express = require("express");
const { getFlats, createFlat, updateFlat, deleteFlat } = require("../controllers/flatController");
const { protect, authorize } = require("../middlewares/authMiddleware");

const router = express.Router();

router.use(protect);

// Guards need to browse flats when creating a visitor entry, so GET allows both roles.
// Only admins can create/edit/delete flats.
router.get("/", authorize("admin", "guard"), getFlats);
router.post("/", authorize("admin"), createFlat);
router.route("/:id").put(authorize("admin"), updateFlat).delete(authorize("admin"), deleteFlat);

module.exports = router;