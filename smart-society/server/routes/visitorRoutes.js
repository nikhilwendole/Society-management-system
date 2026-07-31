// const express = require("express");
// const {
//   createVisitor,
//   getVisitors,
//   updateApprovalStatus,
//   markEntry,
//   markExit,
// } = require("../controllers/visitorController");
// const { protect, authorize } = require("../middlewares/authMiddleware");

// const router = express.Router();

// router.use(protect);

// router.route("/").get(getVisitors).post(authorize("member"), createVisitor);
// router.put("/:id/approval", authorize("admin"), updateApprovalStatus);
// router.put("/:id/entry", authorize("guard"), markEntry);
// router.put("/:id/exit", authorize("guard"), markExit);

// module.exports = router;






// // const express = require("express");
// // const {
// //   createVisitor,
// //   getVisitors,
// //   getVisitorById,
// //   approveVisitor,
// //   rejectVisitor,
// //   markEntry,
// //   markExit,
// //   deleteVisitor,
// // } = require("../controllers/visitorController");
// // const { protect, authorize } = require("../middlewares/authMiddleware");
// // const upload = require("../middlewares/upload");

// // const router = express.Router();

// // router.use(protect);

// // // Guard creates a visitor entry; accepts an optional photo + ID proof upload
// // router.post(
// //   "/",
// //   authorize("guard"),
// //   upload.fields([
// //     { name: "visitorPhoto", maxCount: 1 },
// //     { name: "idProof", maxCount: 1 },
// //   ]),
// //   createVisitor
// // );

// // // Role-scoped list (admin: all, member: own flat, guard: today's by default)
// // router.get("/", getVisitors);
// // router.get("/:id", getVisitorById);

// // // Resident approval workflow
// // router.put("/:id/approve", authorize("member"), approveVisitor);
// // router.put("/:id/reject", authorize("member"), rejectVisitor);

// // // Gate security workflow
// // router.put("/:id/entry", authorize("guard"), markEntry);
// // router.put("/:id/exit", authorize("guard"), markExit);

// // // Admin only
// // router.delete("/:id", authorize("admin"), deleteVisitor);

// // module.exports = router;




const express = require("express");
const {
  createVisitor,
  getVisitors,
  getVisitorById,
  approveVisitor,
  rejectVisitor,
  markEntry,
  markExit,
  deleteVisitor,
} = require("../controllers/visitorController");
const { protect, authorize } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/upload");

const router = express.Router();

router.use(protect);

// Guard creates a visitor entry; accepts an optional photo + ID proof upload
router.post(
  "/",
  authorize("guard"),
  upload.fields([
    { name: "visitorPhoto", maxCount: 1 },
    { name: "idProof", maxCount: 1 },
  ]),
  createVisitor
);

// Role-scoped list (admin: all, member: own flat, guard: today's by default)
router.get("/", getVisitors);
router.get("/:id", getVisitorById);

// Resident approval workflow
router.put("/:id/approve", authorize("member"), approveVisitor);
router.put("/:id/reject", authorize("member"), rejectVisitor);

// Gate security workflow
router.put("/:id/entry", authorize("guard"), markEntry);
router.put("/:id/exit", authorize("guard"), markExit);

// Admin only
router.delete("/:id", authorize("admin"), deleteVisitor);

module.exports = router;