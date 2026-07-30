const Complaint = require("../models/Complaint");
const { uploadBufferToCloudinary } = require("../utils/cloudinaryUpload");

// @desc    Create a complaint (member)
// @route   POST /api/complaints
// @access  Private/Member
const createComplaint = async (req, res, next) => {
  try {
    const { title, description, category, priority } = req.body;

    let image = {};
    if (req.file) {
      const result = await uploadBufferToCloudinary(req.file.buffer, "smart-society/complaints");
      image = { url: result.secure_url, publicId: result.public_id };
    }

    const complaint = await Complaint.create({
      title,
      description,
      category,
      priority,
      image,
      createdBy: req.user._id,
    });

    res.status(201).json({ success: true, complaint });
  } catch (error) {
    next(error);
  }
};

// @desc    Get complaints - admin sees all, member sees only their own
// @route   GET /api/complaints
// @access  Private
const getComplaints = async (req, res, next) => {
  try {
    const filter = req.user.role === "admin" ? {} : { createdBy: req.user._id };
    const complaints = await Complaint.find(filter)
      .populate("createdBy", "name email flat")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: complaints.length, complaints });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single complaint
// @route   GET /api/complaints/:id
// @access  Private
const getComplaintById = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id).populate("createdBy", "name email");
    if (!complaint) return res.status(404).json({ success: false, message: "Complaint not found" });
    res.status(200).json({ success: true, complaint });
  } catch (error) {
    next(error);
  }
};

// @desc    Update complaint status (admin)
// @route   PUT /api/complaints/:id/status
// @access  Private/Admin
const updateComplaintStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const updates = { status };
    if (status === "Resolved") updates.resolvedAt = Date.now();

    const complaint = await Complaint.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!complaint) return res.status(404).json({ success: false, message: "Complaint not found" });
    res.status(200).json({ success: true, complaint });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete complaint
// @route   DELETE /api/complaints/:id
// @access  Private/Admin
const deleteComplaint = async (req, res, next) => {
  try {
    const complaint = await Complaint.findByIdAndDelete(req.params.id);
    if (!complaint) return res.status(404).json({ success: false, message: "Complaint not found" });
    res.status(200).json({ success: true, message: "Complaint deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createComplaint,
  getComplaints,
  getComplaintById,
  updateComplaintStatus,
  deleteComplaint,
};
