const mongoose = require("mongoose");

const flatSchema = new mongoose.Schema(
  {
    flatNumber: { type: String, required: true },
    block: { type: String, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

flatSchema.index({ flatNumber: 1, block: 1 }, { unique: true });

module.exports = mongoose.model("Flat", flatSchema);
