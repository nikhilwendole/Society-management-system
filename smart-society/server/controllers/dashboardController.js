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

    const [totalResidents, totalFlats, pendingComplaints, activeNotices, visitorsToday] =
      await Promise.all([
        User.countDocuments({ role: "member" }),
        Flat.countDocuments(),
        Complaint.countDocuments({ status: "Pending" }),
        Notice.countDocuments(),
        Visitor.countDocuments({ createdAt: { $gte: startOfDay } }),
      ]);

    res.status(200).json({
      success: true,
      stats: { totalResidents, totalFlats, pendingComplaints, activeNotices, visitorsToday },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAdminStats };
