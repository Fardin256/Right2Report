const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  imageUrl: { type: String, default: "" },
  issueType: { type: String, default: "other" },
  description: { type: String, required: true },
  latitude: { type: Number },
  longitude: { type: Number },
  area: { type: String, default: "" },

  authorityName: { type: String, default: "" },
  authorityEmail: { type: String, default: "" },
  authorityPhone: { type: String, default: "" },

  emailStatus: {
    type: String,
    enum: ["pending", "sent", "failed"],
    default: "pending"
  },

  status: {
    type: String,
    enum: ["Pending", "In Progress", "Resolved"],
    default: "Pending"
  }

}, { timestamps: true });

module.exports = mongoose.model("Complaint", complaintSchema);
