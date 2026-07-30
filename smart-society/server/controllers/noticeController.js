const Notice = require("../models/Notice");

// @desc    Get all notices
// @route   GET /api/notices
// @access  Private
const getNotices = async (req, res, next) => {
  try {
    const notices = await Notice.find().populate("createdBy", "name").sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: notices.length, notices });
  } catch (error) {
    next(error);
  }
};

// @desc    Create notice
// @route   POST /api/notices
// @access  Private/Admin
const createNotice = async (req, res, next) => {
  try {
    const { title, description } = req.body;
    const notice = await Notice.create({ title, description, createdBy: req.user._id });
    res.status(201).json({ success: true, notice });
  } catch (error) {
    next(error);
  }
};

// @desc    Update notice
// @route   PUT /api/notices/:id
// @access  Private/Admin
const updateNotice = async (req, res, next) => {
  try {
    const notice = await Notice.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!notice) return res.status(404).json({ success: false, message: "Notice not found" });
    res.status(200).json({ success: true, notice });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete notice
// @route   DELETE /api/notices/:id
// @access  Private/Admin
const deleteNotice = async (req, res, next) => {
  try {
    const notice = await Notice.findByIdAndDelete(req.params.id);
    if (!notice) return res.status(404).json({ success: false, message: "Notice not found" });
    res.status(200).json({ success: true, message: "Notice deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = { getNotices, createNotice, updateNotice, deleteNotice };
