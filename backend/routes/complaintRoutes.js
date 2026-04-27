const express = require("express");
const router = express.Router();
const { reportComplaint, getUserComplaints, searchComplaintsByArea } = require("../controllers/complaintController");
const upload = require("../middleware/upload");
const protect = require("../middleware/authMiddleware");
const Authority = require("../models/authority");
const Complaint = require("../models/complaint");

router.get("/ping", (req, res) => res.json({ ok: true }));

router.get("/get-authority", async (req, res) => {
  try {
    const area = req.query.area || "";
    const issueType = req.query.issueType || "";

    const parts = area.split(",");
    const city = parts[parts.length - 1].trim();

    console.log("CITY:", city, "ISSUE:", issueType);

    let authority = await Authority.findOne({ area: new RegExp(city, "i"), issueType: new RegExp(issueType, "i") });
    if (!authority) authority = await Authority.findOne({ area: new RegExp(city, "i") });

    if (!authority) return res.status(404).json({ message: "No authority found" });

    res.json({ department: authority.department, email: authority.email, phone: authority.phone });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/report", protect, upload.single("image"), reportComplaint);
router.get("/my", protect, getUserComplaints);
router.get("/search", searchComplaintsByArea);
// GET all complaints (admin only)
router.get("/all", protect, async (req, res) => {
  try {
    const complaints = await Complaint.find({}).populate("userId", "name email").sort({ createdAt: -1 });
    res.json({ complaints });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// PUT update complaint status (admin only)
router.put("/status/:id", protect, async (req, res) => {
  try {
    const { status } = req.body;
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!complaint) return res.status(404).json({ message: "Complaint not found" });
    res.json({ message: "Status updated", complaint });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE complaint (admin only)
router.delete("/:id", protect, async (req, res) => {
  try {
    await Complaint.findByIdAndDelete(req.params.id);
    res.json({ message: "Complaint deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});
module.exports = router;