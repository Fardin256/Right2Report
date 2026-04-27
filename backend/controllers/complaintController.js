const Complaint = require("../models/complaint");
const User = require("../models/user");
const cloudinary = require("../config/cloudinary");
const detectIssue = require("../config/vision");
const Authority = require("../models/authority");
const sendEmail = require("../config/email");

// POST /api/complaint/report
exports.reportComplaint = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { latitude, longitude, area, description, issueType: manualIssueType } = req.body;

    if (!userId) return res.status(401).json({ message: "Invalid token" });
    if (!area) return res.status(400).json({ message: "Area is required" });
    if (!description) return res.status(400).json({ message: "Description is required" });

    // Get user info for email
    const user = await User.findById(userId).select("name email");

    let imageUrl = "";

    // Upload image to Cloudinary
    if (req.file) {
      try {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "rtr_complaints",
          categorization: "aws_rek_tagging",
          auto_tagging: 0.6
        });
        imageUrl = result.secure_url;
        console.log("Image uploaded:", imageUrl);
      } catch (uploadError) {
        console.error("Cloudinary upload failed:", uploadError.message);
      }
    }

    // AI detection of issue type
    let issueType = manualIssueType || "other";
    console.log("Using issueType:", issueType);

    // Find responsible authority
    let authority = await Authority.findOne({
      area: { $regex: area, $options: "i" },
      issueType: { $regex: issueType, $options: "i" }
    });

    if (!authority) {
      authority = await Authority.findOne({
        area: { $regex: area, $options: "i" }
      });
    }

    if (!authority) {
      // Try matching by state extracted from area string
      const parts = area.split(",");
      const state = parts.length > 1 ? parts[parts.length - 1].trim() : area.trim();
      authority = await Authority.findOne({
        area: { $regex: state, $options: "i" }
      });
    }

    if (!authority) {
      return res.status(404).json({
        message: "No responsible authority found for this area. Please contact your local municipal office."
      });
    }

    // Save complaint to MongoDB
    const complaint = new Complaint({
      userId,
      issueType,
      latitude,
      longitude,
      area,
      description,
      imageUrl,
      authorityName: authority.department,
      authorityEmail: authority.email,
      authorityPhone: authority.phone,
      status: "Pending",
      emailStatus: "pending"
    });

    await complaint.save();

    // Send email to authority with image
    try {
      await sendEmail({
        to: authority.email,
        issueType,
        area,
        description,
        imageUrl,
        latitude,
        longitude,
        userName: user?.name || "Citizen"
      });

      complaint.emailStatus = "sent";
      await complaint.save();
      console.log("Email sent to:", authority.email);
    } catch (emailError) {
      console.error("Email sending failed:", emailError.message);
      complaint.emailStatus = "failed";
      await complaint.save();
    }

    res.status(201).json({
      message: "Complaint submitted successfully",
      complaint,
      authority: {
        department: authority.department,
        email: authority.email,
        phone: authority.phone
      }
    });

  } catch (error) {
    console.error("reportComplaint error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// GET /api/complaint/my
exports.getUserComplaints = async (req, res) => {
  try {
    const userId = req.user.id;

    const [user, complaints] = await Promise.all([
      User.findById(userId).select("name email createdAt"),
      Complaint.find({ userId }).sort({ createdAt: -1 })
    ]);

    const total = complaints.length;
    const resolved = complaints.filter(c => c.status === "Resolved").length;
    const pending = complaints.filter(c => c.status === "Pending" || c.status === "In Progress").length;

    res.status(200).json({
      user: {
        name: user?.name || "",
        email: user?.email || "",
        memberSince: user?.createdAt
      },
      stats: { total, resolved, pending },
      complaints
    });

  } catch (error) {
    console.error("getUserComplaints error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// GET /api/complaint/search
exports.searchComplaintsByArea = async (req, res) => {
  try {
    const { area } = req.query;
    if (!area) return res.status(400).json({ message: "Area parameter is required" });

    const parts = area.split(",");
    const state = parts.length > 1 ? parts[parts.length - 1].trim() : area.trim();

    const complaints = await Complaint.find({
      area: { $regex: state, $options: "i" }
    }).sort({ createdAt: -1 });

    res.status(200).json({ count: complaints.length, searchedState: state, complaints });

  } catch (error) {
    console.error("searchComplaintsByArea error:", error);
    res.status(500).json({ error: "Server error" });
  }
};
