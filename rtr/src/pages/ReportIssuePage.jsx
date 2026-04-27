import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { submitComplaint, getAuthority } from "../api/complaints";

const ReportIssuePage = () => {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [issueType, setIssueType] = useState("");
  const [description, setDescription] = useState("");
  const [authority, setAuthority] = useState(null);
  const [area, setArea] = useState("");
  const [location, setLocation] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  const [isFetchingDept, setIsFetchingDept] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [submitted, setSubmitted] = useState(false);

  const showMsg = (text, type = "info") => setMessage({ text, type });

  const reverseGeocode = async (lat, lng) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`,
        { headers: { "Accept": "application/json" } }
      );
      const data = await res.json();
      const address = data.address || {};
      const locality = address.suburb || address.city_district || address.neighbourhood || address.town || address.village || address.city || "";
      const state = address.state || address.region || address.city || "";
      const resolved = locality && state && locality !== state ? `${locality}, ${state}` : locality || state || "";
      setArea(resolved);
      showMsg(resolved ? `📍 Location detected: ${resolved}` : "Location detected but area not resolved", "success");
    } catch {
      showMsg("Location detected but area could not be resolved.", "warning");
    } finally {
      setIsLocating(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setAuthority(null);
    }
  };

  const detectLocation = () => {
    if (!navigator.geolocation) { showMsg("Geolocation not supported by your browser", "error"); return; }
    setIsLocating(true);
    showMsg("Detecting your location...", "info");
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        await reverseGeocode(pos.coords.latitude, pos.coords.longitude);
      },
      () => { showMsg("Unable to detect location. Please allow location access.", "error"); setIsLocating(false); }
    );
  };

  const fetchDepartment = async () => {
    if (!area) { showMsg("Please detect location first", "error"); return; }
    if (!issueType) { showMsg("Please select issue type first", "error"); return; }
    setIsFetchingDept(true);
    setAuthority(null);
    try {
      const data = await getAuthority(area, issueType);
      if (data.department) {
        setAuthority(data);
        showMsg("✅ Responsible department found!", "success");
      } else {
        showMsg(data.message || "No department found for this area/issue", "warning");
      }
    } catch {
      showMsg("Error fetching department info", "error");
    } finally {
      setIsFetchingDept(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!location || !area) { showMsg("Please detect your location first", "error"); return; }
    if (!image) { showMsg("Please upload an image of the issue", "error"); return; }

    setIsSubmitting(true);
    showMsg("Submitting your complaint...", "info");

    try {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("description", description);
      formData.append("area", area);
      formData.append("issueType", issueType);
      formData.append("latitude", location.lat);
      formData.append("longitude", location.lng);

      const data = await submitComplaint(formData);

      if (data.complaint) {
        setSubmitted(true);
        showMsg("", "");
      } else if (data.message) {
        showMsg(data.message, "error");
      }
    } catch {
      showMsg("Server error. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const msgColors = {
    success: { bg: "#d4edda", color: "#155724", border: "#c3e6cb" },
    error: { bg: "#f8d7da", color: "#721c24", border: "#f5c6cb" },
    warning: { bg: "#fff3cd", color: "#856404", border: "#ffeeba" },
    info: { bg: "#d1ecf1", color: "#0c5460", border: "#bee5eb" },
  };

  if (submitted) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #667eea, #764ba2)", padding: 20 }}>
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          style={{ background: "white", borderRadius: 20, padding: "50px 40px", textAlign: "center", maxWidth: 440, width: "100%" }}>
          <div style={{ fontSize: 70, marginBottom: 16 }}>✅</div>
          <h2 style={{ color: "#28a745", margin: "0 0 12px" }}>Complaint Submitted!</h2>
          <p style={{ color: "#666", marginBottom: 28 }}>Your complaint has been recorded and the concerned department has been notified via email.</p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <button onClick={() => navigate("/dashboard")}
              style={{ padding: "12px 24px", borderRadius: 10, border: "none", background: "#667eea", color: "white", fontWeight: 600, cursor: "pointer", fontSize: 15 }}>
              View Dashboard
            </button>
            <button onClick={() => { setSubmitted(false); setImage(null); setPreview(null); setDescription(""); setArea(""); setLocation(null); setIssueType(""); setAuthority(null); }}
              style={{ padding: "12px 24px", borderRadius: 10, border: "2px solid #667eea", background: "white", color: "#667eea", fontWeight: 600, cursor: "pointer", fontSize: 15 }}>
              Report Another
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #667eea, #764ba2)", padding: "30px 20px", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
        style={{ background: "white", borderRadius: 20, width: "100%", maxWidth: 540, boxShadow: "0 20px 60px rgba(0,0,0,0.2)", overflow: "hidden" }}>

        {/* Header */}
        <div style={{ background: "linear-gradient(135deg, #667eea, #764ba2)", padding: "24px 30px" }}>
          <h2 style={{ margin: 0, color: "white", fontSize: 22 }}>📢 Report Public Issue</h2>
          <p style={{ margin: "6px 0 0", color: "rgba(255,255,255,0.8)", fontSize: 14 }}>Help improve your city by reporting issues</p>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: "28px 30px", display: "flex", flexDirection: "column", gap: 18 }}>

          {/* Step 1 - Image */}
          <div>
            <label style={stepLabel}>📸 Step 1: Upload Issue Photo</label>
            <label style={{ ...uploadBox, border: preview ? "2px solid #667eea" : "2px dashed #ccc" }}>
              {preview ? (
                <img src={preview} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <div style={{ textAlign: "center", color: "#aaa" }}>
                  <div style={{ fontSize: 40, marginBottom: 8 }}>📷</div>
                  <p style={{ margin: 0, fontSize: 14 }}>Click to upload photo</p>
                  <p style={{ margin: "4px 0 0", fontSize: 12 }}>JPG, PNG up to 5MB</p>
                </div>
              )}
              <input type="file" accept="image/*" onChange={handleImageUpload} hidden required />
            </label>
          </div>

          {/* Step 2 - Issue Type */}
          <div>
            <label style={stepLabel}>🏷️ Step 2: Select Issue Type</label>
            <select value={issueType} onChange={(e) => { setIssueType(e.target.value); setAuthority(null); }} style={inputStyle} required>
              <option value="">-- Select Issue Type --</option>
              <option value="road">🛣️ Road Issue (Pothole / Damage)</option>
              <option value="water">💧 Water Leakage / Supply</option>
              <option value="garbage">🗑️ Garbage / Waste</option>
              <option value="electricity">⚡ Electricity Issue</option>
              <option value="other">📋 Other</option>
            </select>
          </div>

          {/* Step 3 - Description */}
          <div>
            <label style={stepLabel}>📝 Step 3: Describe the Issue</label>
            <textarea
              placeholder="Describe the issue in detail..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ ...inputStyle, minHeight: 90, resize: "vertical" }}
              required
            />
          </div>

          {/* Step 4 - Location */}
          <div>
            <label style={stepLabel}>📍 Step 4: Detect Your Location</label>
            <motion.button type="button" onClick={detectLocation} disabled={isLocating} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              style={{ width: "100%", padding: "12px", borderRadius: 10, border: "none", background: isLocating ? "#ccc" : "linear-gradient(135deg, #667eea, #764ba2)", color: "white", fontWeight: 600, cursor: isLocating ? "not-allowed" : "pointer", fontSize: 14 }}>
              {isLocating ? "⏳ Detecting..." : "📍 Get My Location"}
            </motion.button>
            {area && (
              <div style={{ marginTop: 10, padding: "10px 14px", background: "#f0f4ff", borderRadius: 8, border: "1px solid #d0d9ff" }}>
                <p style={{ margin: 0, fontSize: 13, color: "#4a4a8a", fontWeight: 500 }}>📌 {area}</p>
                {location && <p style={{ margin: "3px 0 0", fontSize: 11, color: "#888" }}>GPS: {location.lat.toFixed(5)}, {location.lng.toFixed(5)}</p>}
              </div>
            )}
          </div>

          {/* Step 5 - Fetch Department */}
          <div>
            <label style={stepLabel}>🏢 Step 5: Find Responsible Department</label>
            <motion.button type="button" onClick={fetchDepartment} disabled={isFetchingDept} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              style={{ width: "100%", padding: "12px", borderRadius: 10, border: "2px solid #667eea", background: "white", color: "#667eea", fontWeight: 600, cursor: isFetchingDept ? "not-allowed" : "pointer", fontSize: 14 }}>
              {isFetchingDept ? "⏳ Searching..." : "🔍 Fetch Department"}
            </motion.button>
            <AnimatePresence>
              {authority && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  style={{ marginTop: 12, padding: "14px 16px", background: "#e8f5e9", borderRadius: 10, border: "1px solid #c8e6c9" }}>
                  <p style={{ margin: "0 0 6px", fontWeight: 700, color: "#2e7d32", fontSize: 14 }}>✅ Department Found</p>
                  <p style={{ margin: "3px 0", fontSize: 13, color: "#444" }}>🏢 <strong>{authority.department}</strong></p>
                  <p style={{ margin: "3px 0", fontSize: 13, color: "#444" }}>📞 {authority.phone}</p>
                  <p style={{ margin: "3px 0", fontSize: 13, color: "#444" }}>📧 {authority.email}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Message */}
          <AnimatePresence>
            {message.text && (
              <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                style={{ padding: "12px 16px", borderRadius: 10, fontSize: 13, fontWeight: 500, ...(msgColors[message.type] || msgColors.info) }}>
                {message.text}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit */}
          <motion.button type="submit" disabled={isSubmitting} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            style={{ padding: "14px", borderRadius: 12, border: "none", background: isSubmitting ? "#ccc" : "linear-gradient(135deg, #28a745, #20c997)", color: "white", fontWeight: 700, cursor: isSubmitting ? "not-allowed" : "pointer", fontSize: 16, marginTop: 4 }}>
            {isSubmitting ? "⏳ Submitting..." : "🚀 Submit Complaint"}
          </motion.button>

        </form>
      </motion.div>
    </div>
  );
};

const stepLabel = { display: "block", fontSize: 13, fontWeight: 700, color: "#555", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 };
const inputStyle = { width: "100%", padding: "12px", borderRadius: 10, border: "1.5px solid #ddd", fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "inherit" };
const uploadBox = { display: "flex", borderRadius: 12, height: 180, cursor: "pointer", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" };

export default ReportIssuePage;
