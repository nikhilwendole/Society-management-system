const Visitor = require("../models/Visitor");

// @desc    Member invites a visitor (creates a pending visitor pass request)
// @route   POST /api/visitors
// @access  Private/Member
const createVisitor = async (req, res, next) => {
  try {
    const { visitorName, phone, visitPurpose } = req.body;
    const visitor = await Visitor.create({
      visitorName,
      phone,
      visitPurpose,
      resident: req.user._id,
    });
    res.status(201).json({ success: true, visitor });
  } catch (error) {
    next(error);
  }
};

// @desc    Get visitors - admin/guard see all, member sees only their invites
// @route   GET /api/visitors
// @access  Private
const getVisitors = async (req, res, next) => {
  try {
    const filter = req.user.role === "member" ? { resident: req.user._id } : {};
    const visitors = await Visitor.find(filter)
      .populate("resident", "name phone flat")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: visitors.length, visitors });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin approves or rejects a visitor request
// @route   PUT /api/visitors/:id/approval
// @access  Private/Admin
const updateApprovalStatus = async (req, res, next) => {
  try {
    const { approvalStatus } = req.body; // "Approved" | "Rejected"
    const visitor = await Visitor.findByIdAndUpdate(
      req.params.id,
      { approvalStatus },
      { new: true, runValidators: true }
    );
    if (!visitor) return res.status(404).json({ success: false, message: "Visitor not found" });
    res.status(200).json({ success: true, visitor });
  } catch (error) {
    next(error);
  }
};

// @desc    Guard marks visitor entry
// @route   PUT /api/visitors/:id/entry
// @access  Private/Guard
const markEntry = async (req, res, next) => {
  try {
    const visitor = await Visitor.findById(req.params.id);
    if (!visitor) return res.status(404).json({ success: false, message: "Visitor not found" });

    if (visitor.approvalStatus !== "Approved") {
      return res.status(400).json({ success: false, message: "Visitor is not approved yet" });
    }

    visitor.entryTime = Date.now();
    visitor.verifiedBy = req.user._id;
    await visitor.save();

    res.status(200).json({ success: true, visitor });
  } catch (error) {
    next(error);
  }
};

// @desc    Guard marks visitor exit
// @route   PUT /api/visitors/:id/exit
// @access  Private/Guard
const markExit = async (req, res, next) => {
  try {
    const visitor = await Visitor.findByIdAndUpdate(
      req.params.id,
      { exitTime: Date.now() },
      { new: true }
    );
    if (!visitor) return res.status(404).json({ success: false, message: "Visitor not found" });
    res.status(200).json({ success: true, visitor });
  } catch (error) {
    next(error);
  }
};

module.exports = { createVisitor, getVisitors, updateApprovalStatus, markEntry, markExit };
