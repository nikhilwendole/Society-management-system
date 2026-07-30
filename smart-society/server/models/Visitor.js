const mongoose = require("mongoose");

const visitorSchema = new mongoose.Schema(
  {
    visitorName: { type: String, required: true },
    phone: { type: String, required: true },
    resident: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    visitPurpose: { type: String, required: true },
    entryTime: { type: Date },
    exitTime: { type: Date },
    approvalStatus: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // guard who checked entry/exit
  },
  { timestamps: true }
);

module.exports = mongoose.model("Visitor", visitorSchema);
