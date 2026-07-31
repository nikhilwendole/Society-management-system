// const Visitor = require("../models/Visitor");

// // @desc    Member invites a visitor (creates a pending visitor pass request)
// // @route   POST /api/visitors
// // @access  Private/Member
// const createVisitor = async (req, res, next) => {
//   try {
//     const { visitorName, phone, visitPurpose } = req.body;
//     const visitor = await Visitor.create({
//       visitorName,
//       phone,
//       visitPurpose,
//       resident: req.user._id,
//     });
//     res.status(201).json({ success: true, visitor });
//   } catch (error) {
//     next(error);
//   }
// };

// // @desc    Get visitors - admin/guard see all, member sees only their invites
// // @route   GET /api/visitors
// // @access  Private
// const getVisitors = async (req, res, next) => {
//   try {
//     const filter = req.user.role === "member" ? { resident: req.user._id } : {};
//     const visitors = await Visitor.find(filter)
//       .populate("resident", "name phone flat")
//       .sort({ createdAt: -1 });
//     res.status(200).json({ success: true, count: visitors.length, visitors });
//   } catch (error) {
//     next(error);
//   }
// };

// // @desc    Admin approves or rejects a visitor request
// // @route   PUT /api/visitors/:id/approval
// // @access  Private/Admin
// const updateApprovalStatus = async (req, res, next) => {
//   try {
//     const { approvalStatus } = req.body; // "Approved" | "Rejected"
//     const visitor = await Visitor.findByIdAndUpdate(
//       req.params.id,
//       { approvalStatus },
//       { new: true, runValidators: true }
//     );
//     if (!visitor) return res.status(404).json({ success: false, message: "Visitor not found" });
//     res.status(200).json({ success: true, visitor });
//   } catch (error) {
//     next(error);
//   }
// };

// // @desc    Guard marks visitor entry
// // @route   PUT /api/visitors/:id/entry
// // @access  Private/Guard
// const markEntry = async (req, res, next) => {
//   try {
//     const visitor = await Visitor.findById(req.params.id);
//     if (!visitor) return res.status(404).json({ success: false, message: "Visitor not found" });

//     if (visitor.approvalStatus !== "Approved") {
//       return res.status(400).json({ success: false, message: "Visitor is not approved yet" });
//     }

//     visitor.entryTime = Date.now();
//     visitor.verifiedBy = req.user._id;
//     await visitor.save();

//     res.status(200).json({ success: true, visitor });
//   } catch (error) {
//     next(error);
//   }
// };

// // @desc    Guard marks visitor exit
// // @route   PUT /api/visitors/:id/exit
// // @access  Private/Guard
// const markExit = async (req, res, next) => {
//   try {
//     const visitor = await Visitor.findByIdAndUpdate(
//       req.params.id,
//       { exitTime: Date.now() },
//       { new: true }
//     );
//     if (!visitor) return res.status(404).json({ success: false, message: "Visitor not found" });
//     res.status(200).json({ success: true, visitor });
//   } catch (error) {
//     next(error);
//   }
// };

// module.exports = { createVisitor, getVisitors, updateApprovalStatus, markEntry, markExit };






const Visitor = require("../models/Visitor");
const Flat = require("../models/Flat");
const { uploadBufferToCloudinary } = require("../utils/cloudinaryUpload");
const { notifyResident, notifyGuards } = require("../utils/notificationService");

const startOfToday = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

// @desc    Security guard creates a visitor entry request
// @route   POST /api/visitors
// @access  Private/Guard
const createVisitor = async (req, res, next) => {
  try {
    const {
      visitorName,
      visitorType,
      mobile,
      vehicleNumber,
      purpose,
      flat,
      numberOfVisitors,
      expectedExitTime,
      remarks,
    } = req.body;

    if (!visitorName || !mobile || !purpose || !flat) {
      return res.status(400).json({
        success: false,
        message: "visitorName, mobile, purpose and flat are required",
      });
    }

    const flatDoc = await Flat.findById(flat).populate("owner", "name");
    if (!flatDoc) {
      return res.status(404).json({ success: false, message: "Selected flat does not exist" });
    }
    if (!flatDoc.owner) {
      return res.status(400).json({
        success: false,
        message: "This flat has no resident assigned yet, so a visitor request can't be routed",
      });
    }

    // Upload visitor photo / ID proof to Cloudinary if provided
    let visitorPhoto = {};
    let idProof = {};

    if (req.files?.visitorPhoto?.[0]) {
      const result = await uploadBufferToCloudinary(
        req.files.visitorPhoto[0].buffer,
        "smart-society/visitors/photos"
      );
      visitorPhoto = { url: result.secure_url, publicId: result.public_id };
    }

    if (req.files?.idProof?.[0]) {
      const result = await uploadBufferToCloudinary(
        req.files.idProof[0].buffer,
        "smart-society/visitors/id-proofs"
      );
      idProof = { url: result.secure_url, publicId: result.public_id };
    }

    const visitor = await Visitor.create({
      visitorName,
      visitorType,
      mobile,
      vehicleNumber,
      purpose,
      flat,
      resident: flatDoc.owner._id,
      numberOfVisitors: numberOfVisitors || 1,
      visitorPhoto,
      idProof,
      expectedExitTime: expectedExitTime || undefined,
      remarks,
      createdBySecurity: req.user._id,
    });

    notifyResident(flatDoc.owner._id, visitor);

    res.status(201).json({ success: true, visitor });
  } catch (error) {
    next(error);
  }
};

// @desc    Get visitors - role-scoped, with optional search/filters
//          Admin: all visitors | Resident: only their own flat's visitors
//          Guard: today's visitors by default (pass ?all=true for full history)
// @route   GET /api/visitors?status=&visitorType=&date=&flat=&search=&all=
// @access  Private
const getVisitors = async (req, res, next) => {
  try {
    const { status, visitorType, date, flat, search, all } = req.query;
    const filter = {};

    if (req.user.role === "member") {
      filter.resident = req.user._id;
    } else if (req.user.role === "guard" && all !== "true" && !date) {
      filter.createdAt = { $gte: startOfToday() };
    }
    // admin sees everything by default

    if (status) filter.status = status;
    if (visitorType) filter.visitorType = visitorType;
    if (flat) filter.flat = flat;

    if (date) {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      filter.createdAt = { $gte: start, $lte: end };
    }

    if (search) {
      const regex = new RegExp(search, "i");
      filter.$or = [{ visitorName: regex }, { mobile: regex }, { vehicleNumber: regex }];
    }

    const visitors = await Visitor.find(filter)
      .populate("flat", "flatNumber block")
      .populate("resident", "name phone")
      .populate("createdBySecurity", "name")
      .populate("approvedBy", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: visitors.length, visitors });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single visitor's full detail (used for the approval card / history view)
// @route   GET /api/visitors/:id
// @access  Private
const getVisitorById = async (req, res, next) => {
  try {
    const visitor = await Visitor.findById(req.params.id)
      .populate("flat", "flatNumber block")
      .populate("resident", "name phone")
      .populate("createdBySecurity", "name")
      .populate("approvedBy", "name");

    if (!visitor) return res.status(404).json({ success: false, message: "Visitor not found" });

    // Residents can only view visitors tied to their own flat
    if (req.user.role === "member" && visitor.resident._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized to view this visitor" });
    }

    res.status(200).json({ success: true, visitor });
  } catch (error) {
    next(error);
  }
};

// @desc    Resident approves a visitor request for their own flat
// @route   PUT /api/visitors/:id/approve
// @access  Private/Member
const approveVisitor = async (req, res, next) => {
  try {
    const visitor = await Visitor.findById(req.params.id);
    if (!visitor) return res.status(404).json({ success: false, message: "Visitor not found" });

    if (visitor.resident.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ success: false, message: "You can only approve visitors for your own flat" });
    }
    if (visitor.status !== "Pending") {
      return res.status(400).json({ success: false, message: `Visitor is already ${visitor.status}` });
    }

    visitor.status = "Approved";
    visitor.approvedBy = req.user._id;
    visitor.approvedAt = Date.now();
    await visitor.save();

    notifyGuards(visitor, "Approved");

    res.status(200).json({ success: true, visitor });
  } catch (error) {
    next(error);
  }
};

// @desc    Resident rejects a visitor request for their own flat
// @route   PUT /api/visitors/:id/reject
// @access  Private/Member
const rejectVisitor = async (req, res, next) => {
  try {
    const visitor = await Visitor.findById(req.params.id);
    if (!visitor) return res.status(404).json({ success: false, message: "Visitor not found" });

    if (visitor.resident.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ success: false, message: "You can only reject visitors for your own flat" });
    }
    if (visitor.status !== "Pending") {
      return res.status(400).json({ success: false, message: `Visitor is already ${visitor.status}` });
    }

    visitor.status = "Rejected";
    visitor.rejectedAt = Date.now();
    visitor.rejectReason = req.body.rejectReason || "";
    await visitor.save();

    notifyGuards(visitor, "Rejected");

    res.status(200).json({ success: true, visitor });
  } catch (error) {
    next(error);
  }
};

// @desc    Guard confirms physical entry once a visitor is Approved
// @route   PUT /api/visitors/:id/entry
// @access  Private/Guard
const markEntry = async (req, res, next) => {
  try {
    const visitor = await Visitor.findById(req.params.id);
    if (!visitor) return res.status(404).json({ success: false, message: "Visitor not found" });

    if (visitor.status !== "Approved") {
      return res.status(400).json({
        success: false,
        message: `Cannot allow entry - visitor status is "${visitor.status}", not "Approved"`,
      });
    }

    visitor.status = "Entered";
    visitor.entryTime = Date.now();
    await visitor.save();

    res.status(200).json({ success: true, visitor });
  } catch (error) {
    next(error);
  }
};

// @desc    Guard confirms visitor exit
// @route   PUT /api/visitors/:id/exit
// @access  Private/Guard
const markExit = async (req, res, next) => {
  try {
    const visitor = await Visitor.findById(req.params.id);
    if (!visitor) return res.status(404).json({ success: false, message: "Visitor not found" });

    if (visitor.status !== "Entered") {
      return res.status(400).json({
        success: false,
        message: `Cannot mark exit - visitor status is "${visitor.status}", not "Entered"`,
      });
    }

    visitor.status = "Exited";
    visitor.exitTime = Date.now();
    await visitor.save();

    res.status(200).json({ success: true, visitor });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a visitor record
// @route   DELETE /api/visitors/:id
// @access  Private/Admin
const deleteVisitor = async (req, res, next) => {
  try {
    const visitor = await Visitor.findByIdAndDelete(req.params.id);
    if (!visitor) return res.status(404).json({ success: false, message: "Visitor not found" });
    res.status(200).json({ success: true, message: "Visitor record deleted" });
  } catch (error) {
    next(error);
  }
};

// module.exports = {
//   createVisitor,
//   getVisitors,
//   getVisitorById,
//   approveVisitor,
//   rejectVisitor,
//   markEntry,
//   markExit,
//   deleteVisitor,
// };



module.exports = {
     createVisitor,
     getVisitors,
     getVisitorById,
     approveVisitor,
     rejectVisitor,
     markEntry,
     markExit,
     deleteVisitor,
   };