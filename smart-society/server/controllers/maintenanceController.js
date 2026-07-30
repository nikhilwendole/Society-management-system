const Maintenance = require("../models/Maintenance");

// @desc    Admin creates a monthly maintenance bill for a flat
// @route   POST /api/maintenance
// @access  Private/Admin
const createBill = async (req, res, next) => {
  try {
    const { flat, resident, amount, month } = req.body;
    const bill = await Maintenance.create({ flat, resident, amount, month });
    res.status(201).json({ success: true, bill });
  } catch (error) {
    next(error);
  }
};

// @desc    Get bills - admin sees all, member sees only their own
// @route   GET /api/maintenance
// @access  Private
const getBills = async (req, res, next) => {
  try {
    const filter = req.user.role === "admin" ? {} : { resident: req.user._id };
    const bills = await Maintenance.find(filter)
      .populate("flat", "flatNumber block")
      .populate("resident", "name email")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: bills.length, bills });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin marks a bill as paid
// @route   PUT /api/maintenance/:id/pay
// @access  Private/Admin
const markPaid = async (req, res, next) => {
  try {
    const bill = await Maintenance.findByIdAndUpdate(
      req.params.id,
      { paymentStatus: "Paid", paidAt: Date.now() },
      { new: true }
    );
    if (!bill) return res.status(404).json({ success: false, message: "Bill not found" });
    res.status(200).json({ success: true, bill });
  } catch (error) {
    next(error);
  }
};

module.exports = { createBill, getBills, markPaid };
