// const User = require("../models/User");
// const Flat = require("../models/Flat");
// const Complaint = require("../models/Complaint");
// const Notice = require("../models/Notice");
// const Visitor = require("../models/Visitor");

// // @desc    Admin dashboard summary stats
// // @route   GET /api/dashboard/admin
// // @access  Private/Admin
// const getAdminStats = async (req, res, next) => {
//   try {
//     const startOfDay = new Date();
//     startOfDay.setHours(0, 0, 0, 0);

//     const [totalResidents, totalFlats, pendingComplaints, activeNotices, visitorsToday] =
//       await Promise.all([
//         User.countDocuments({ role: "member" }),
//         Flat.countDocuments(),
//         Complaint.countDocuments({ status: "Pending" }),
//         Notice.countDocuments(),
//         Visitor.countDocuments({ createdAt: { $gte: startOfDay } }),
//       ]);

//     res.status(200).json({
//       success: true,
//       stats: { totalResidents, totalFlats, pendingComplaints, activeNotices, visitorsToday },
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// module.exports = { getAdminStats };






const User = require("../models/User");
const Flat = require("../models/Flat");
const Complaint = require("../models/Complaint");
const Notice = require("../models/Notice");
const Visitor = require("../models/Visitor");

// @desc    Admin dashboard summary stats
// @route   GET /api/dashboard/admin
// @access  Private/Admin
const getAdminStats = async (req, res, next) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const [
      totalResidents,
      totalFlats,
      pendingComplaints,
      activeNotices,
      visitorsToday,
      pendingVisitorApprovals,
      visitorsInsideNow,
      approvedVisitorsToday,
      rejectedVisitorsToday,
      exitedVisitorsToday,
    ] = await Promise.all([
      User.countDocuments({ role: "member" }),
      Flat.countDocuments(),
      Complaint.countDocuments({ status: "Pending" }),
      Notice.countDocuments(),
      Visitor.countDocuments({ createdAt: { $gte: startOfDay } }),
      Visitor.countDocuments({ status: "Pending" }),
      Visitor.countDocuments({ status: "Entered" }),
      Visitor.countDocuments({ status: "Approved", approvedAt: { $gte: startOfDay } }),
      Visitor.countDocuments({ status: "Rejected", rejectedAt: { $gte: startOfDay } }),
      Visitor.countDocuments({ status: "Exited", exitTime: { $gte: startOfDay } }),
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalResidents,
        totalFlats,
        pendingComplaints,
        activeNotices,
        visitorsToday,
        pendingVisitorApprovals,
        visitorsInsideNow,
        approvedVisitorsToday,
        rejectedVisitorsToday,
        exitedVisitorsToday,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAdminStats };