const Flat = require("../models/Flat");

// @desc    Get all flats
// @route   GET /api/flats
// @access  Private/Admin
const getFlats = async (req, res, next) => {
  try {
    const flats = await Flat.find().populate("owner", "name email").populate("members", "name email");
    res.status(200).json({ success: true, count: flats.length, flats });
  } catch (error) {
    next(error);
  }
};

// @desc    Create flat
// @route   POST /api/flats
// @access  Private/Admin
const createFlat = async (req, res, next) => {
  try {
    const flat = await Flat.create(req.body);
    res.status(201).json({ success: true, flat });
  } catch (error) {
    next(error);
  }
};

// @desc    Update flat
// @route   PUT /api/flats/:id
// @access  Private/Admin
const updateFlat = async (req, res, next) => {
  try {
    const flat = await Flat.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!flat) return res.status(404).json({ success: false, message: "Flat not found" });
    res.status(200).json({ success: true, flat });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete flat
// @route   DELETE /api/flats/:id
// @access  Private/Admin
const deleteFlat = async (req, res, next) => {
  try {
    const flat = await Flat.findByIdAndDelete(req.params.id);
    if (!flat) return res.status(404).json({ success: false, message: "Flat not found" });
    res.status(200).json({ success: true, message: "Flat deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = { getFlats, createFlat, updateFlat, deleteFlat };
