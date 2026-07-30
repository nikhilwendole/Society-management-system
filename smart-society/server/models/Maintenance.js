const mongoose = require("mongoose");

const maintenanceSchema = new mongoose.Schema(
  {
    flat: { type: mongoose.Schema.Types.ObjectId, ref: "Flat", required: true },
    resident: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    month: { type: String, required: true }, // e.g. "2026-07"
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid"],
      default: "Pending",
    },
    paidAt: Date,
    receipt: { type: String, default: "" }, // Cloudinary URL of generated/uploaded receipt
  },
  { timestamps: true }
);

maintenanceSchema.index({ flat: 1, month: 1 }, { unique: true });

module.exports = mongoose.model("Maintenance", maintenanceSchema);
