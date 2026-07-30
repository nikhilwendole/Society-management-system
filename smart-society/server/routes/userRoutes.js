const express = require("express");
const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateProfileImage,
  deleteUser,
} = require("../controllers/userController");
const { protect, authorize } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/upload");

const router = express.Router();

router.use(protect);

router.get("/", authorize("admin"), getUsers);
router.post("/", authorize("admin"), createUser);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.put("/:id/profile-image", upload.single("image"), updateProfileImage);
router.delete("/:id", authorize("admin"), deleteUser);

module.exports = router;
