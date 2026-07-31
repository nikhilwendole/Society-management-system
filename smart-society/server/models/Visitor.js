// const mongoose = require("mongoose");

// const visitorSchema = new mongoose.Schema(
//   {
//     visitorName: { type: String, required: true },
//     phone: { type: String, required: true },
//     resident: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//     visitPurpose: { type: String, required: true },
//     entryTime: { type: Date },
//     exitTime: { type: Date },
//     approvalStatus: {
//       type: String,
//       enum: ["Pending", "Approved", "Rejected"],
//       default: "Pending",
//     },
//     verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // guard who checked entry/exit
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Visitor", visitorSchema);



const mongoose = require("mongoose");

const VISITOR_TYPES = [
  "Guest",
  "Delivery",
  "Maid",
  "Electrician",
  "Plumber",
  "Technician",
  "Driver",
  "Family",
  "Relative",
  "Friend",
  "Courier",
  "Other",
];

const STATUSES = ["Pending", "Approved", "Rejected", "Entered", "Exited"];

const visitorSchema = new mongoose.Schema(
  {
    visitorName: { type: String, required: true, trim: true },
    visitorType: { type: String, enum: VISITOR_TYPES, default: "Guest" },
    mobile: {
      type: String,
      required: true,
      validate: {
        validator: (v) => /^[0-9]{10}$/.test(v),
        message: "Mobile number must be exactly 10 digits",
      },
    },
    vehicleNumber: { type: String, trim: true, uppercase: true },
    purpose: { type: String, required: true, trim: true },

    flat: { type: mongoose.Schema.Types.ObjectId, ref: "Flat", required: true },
    resident: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    numberOfVisitors: { type: Number, default: 1, min: 1 },

    visitorPhoto: {
      url: { type: String, default: "" },
      publicId: { type: String, default: "" },
    },
    idProof: {
      url: { type: String, default: "" },
      publicId: { type: String, default: "" },
    },

    status: { type: String, enum: STATUSES, default: "Pending" },

    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    approvedAt: Date,
    rejectedAt: Date,
    rejectReason: { type: String, trim: true },

    entryTime: Date,
    exitTime: Date,
    expectedExitTime: Date,

    remarks: { type: String, trim: true },
    createdBySecurity: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

visitorSchema.index({ visitorName: "text", mobile: "text", vehicleNumber: "text" });

module.exports = mongoose.model("Visitor", visitorSchema);
module.exports.VISITOR_TYPES = VISITOR_TYPES;
module.exports.STATUSES = STATUSES;