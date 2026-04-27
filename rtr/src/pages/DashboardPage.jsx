import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaMapMarkedAlt, FaClipboardList, FaCheckCircle, FaPlus, FaSignOutAlt, FaUser, FaCalendarAlt, FaMapPin, FaChevronDown, FaChevronUp, FaExclamationTriangle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { getMyComplaints } from "../api/complaints";

const statusColor = (status) => {
  if (status === "Resolved") return { bg: "#d4edda", color: "#155724", border: "#c3e6cb" };
  if (status === "In Progress") return { bg: "#fff3cd", color: "#856404", border: "#ffeeba" };
  return { bg: "#f8d7da", color: "#721c24", border: "#f5c6cb" };
};

const issueIcon = (type) => {
  const icons = { garbage: "🗑️", road: "🛣️", pothole: "🕳️", water: "💧", electricity: "⚡", graffiti: "🎨", other: "📋" };
  return icons[type?.toLowerCase()] || "📋";
};

const ComplaintCard = ({ complaint }) => {
  const [open, setOpen] = useState(false);
  const s = statusColor(complaint.status);
  const date = new Date(complaint.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

  return (
    <motion.div
      layout
      style={{ background: "#fff", borderRadius: 14, marginBottom: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.08)", overflow: "hidden", border: "1px solid #eee" }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Card Header */}
      <div
        onClick={() => setOpen(!open)}
        style={{ padding: "18px 20px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ fontSize: 28 }}>{issueIcon(complaint.issueType)}</span>
          <div>
            <h4 style={{ margin: 0, textTransform: "capitalize", fontSize: 16, color: "#333" }}>{complaint.issueType || "General Issue"}</h4>
            <p style={{ margin: "3px 0 0", fontSize: 13, color: "#888", display: "flex", alignItems: "center", gap: 5 }}>
              <FaMapPin size={11} /> {complaint.area || "Unknown area"}
              &nbsp;·&nbsp;
              <FaCalendarAlt size={11} /> {date}
            </p>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600, background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>
            {complaint.status || "Pending"}
          </span>
          {open ? <FaChevronUp color="#999" /> : <FaChevronDown color="#999" />}
        </div>
      </div>

      {/* Expanded Details */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ overflow: "hidden" }}
          >
            <div style={{ borderTop: "1px solid #f0f0f0", padding: "20px" }}>
              {complaint.imageUrl && (
                <img
                  src={complaint.imageUrl}
                  alt="Complaint"
                  style={{ width: "100%", maxHeight: 220, objectFit: "cover", borderRadius: 10, marginBottom: 16 }}
                />
              )}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div style={detailBox}>
                  <span style={detailLabel}>📝 Description</span>
                  <span style={detailValue}>{complaint.description || "N/A"}</span>
                </div>
                <div style={detailBox}>
                  <span style={detailLabel}>🏢 Department</span>
                  <span style={detailValue}>{complaint.authorityName || "N/A"}</span>
                </div>
                <div style={detailBox}>
                  <span style={detailLabel}>📞 Phone</span>
                  <span style={detailValue}>{complaint.authorityPhone || "N/A"}</span>
                </div>
                <div style={detailBox}>
                  <span style={detailLabel}>📧 Email Status</span>
                  <span style={{ ...detailValue, color: complaint.emailStatus === "sent" ? "#28a745" : "#dc3545" }}>
                    {complaint.emailStatus === "sent" ? "✅ Email Sent" : "⏳ Pending"}
                  </span>
                </div>
                {complaint.latitude && (
                  <div style={{ ...detailBox, gridColumn: "1 / -1" }}>
                    <span style={detailLabel}>📍 GPS Location</span>
                    <span style={detailValue}>Lat: {complaint.latitude?.toFixed(5)}, Lng: {complaint.longitude?.toFixed(5)}</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const detailBox = { background: "#f9f9f9", borderRadius: 8, padding: "10px 14px", display: "flex", flexDirection: "column", gap: 4 };
const detailLabel = { fontSize: 11, color: "#999", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 };
const detailValue = { fontSize: 14, color: "#444", fontWeight: 500 };

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState({ total: 0, resolved: 0, pending: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => { fetchDashboardData(); }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const data = await getMyComplaints();
      if (!data) return;
      setUser(data.user || {});
      setReports(data.complaints || []);
      setStats(data.stats || { total: 0, resolved: 0, pending: 0 });
      setError("");
    } catch (err) {
      setError("Unable to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { label: "Total Reports", val: stats.total, icon: <FaClipboardList />, color: "#667eea", bg: "#eef0ff" },
    { label: "Resolved", val: stats.resolved, icon: <FaCheckCircle />, color: "#28a745", bg: "#e8f5e9" },
    { label: "Pending", val: stats.pending, icon: <FaExclamationTriangle />, color: "#ffc107", bg: "#fff8e1" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#f4f6fb", padding: "30px 20px" }}>
      <div style={{ maxWidth: 900, margin: "auto" }}>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ background: "linear-gradient(135deg, #667eea, #764ba2)", borderRadius: 20, padding: "28px 30px", marginBottom: 28, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(255,255,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, border: "3px solid rgba(255,255,255,0.5)" }}>
              <FaUser color="white" />
            </div>
            <div>
              <h2 style={{ margin: 0, color: "white", fontSize: 22 }}>{user.name || "User"}</h2>
              <p style={{ margin: "4px 0 0", color: "rgba(255,255,255,0.8)", fontSize: 14 }}>{user.email || ""}</p>
              {user.memberSince && (
                <p style={{ margin: "2px 0 0", color: "rgba(255,255,255,0.6)", fontSize: 12 }}>
                  Member since {new Date(user.memberSince).toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
                </p>
              )}
            </div>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <Link to="/reportissue" style={{ textDecoration: "none" }}>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                style={{ padding: "10px 20px", borderRadius: 12, border: "none", background: "white", color: "#667eea", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, fontSize: 14 }}>
                <FaPlus /> Report Issue
              </motion.button>
            </Link>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              style={{ padding: "10px 18px", borderRadius: 12, border: "2px solid rgba(255,255,255,0.5)", background: "transparent", color: "white", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, fontSize: 14 }}>
              <FaSignOutAlt /> Logout
            </motion.button>
          </div>
        </motion.div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 28 }}>
          {statCards.map((s, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4, boxShadow: "0 8px 24px rgba(0,0,0,0.1)" }}
              style={{ background: "white", borderRadius: 16, padding: "22px 20px", textAlign: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", cursor: "default" }}>
              <div style={{ width: 48, height: 48, borderRadius: "50%", background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", fontSize: 20, color: s.color }}>
                {s.icon}
              </div>
              <h2 style={{ margin: 0, fontSize: 32, fontWeight: 800, color: s.color }}>{s.val}</h2>
              <p style={{ margin: "4px 0 0", color: "#888", fontSize: 13, fontWeight: 500 }}>{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Complaint History */}
        <div style={{ background: "white", borderRadius: 20, padding: "24px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <h3 style={{ margin: "0 0 20px", fontSize: 18, color: "#333", display: "flex", alignItems: "center", gap: 10 }}>
            <FaClipboardList color="#667eea" /> Complaint History
          </h3>

          {loading ? (
            <div style={{ textAlign: "center", padding: "40px", color: "#999" }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>⏳</div>
              <p>Loading your complaints...</p>
            </div>
          ) : error ? (
            <div style={{ textAlign: "center", padding: "40px", color: "#dc3545" }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>⚠️</div>
              <p>{error}</p>
              <button onClick={fetchDashboardData} style={{ padding: "8px 20px", borderRadius: 8, border: "none", background: "#667eea", color: "white", cursor: "pointer", marginTop: 8 }}>Retry</button>
            </div>
          ) : reports.length === 0 ? (
            <div style={{ textAlign: "center", padding: "50px 20px", color: "#bbb" }}>
              <div style={{ fontSize: 52, marginBottom: 14 }}>📭</div>
              <h4 style={{ color: "#999", margin: 0 }}>No complaints yet</h4>
              <p style={{ fontSize: 14, marginTop: 8 }}>
                <Link to="/reportissue" style={{ color: "#667eea", fontWeight: 600 }}>Report your first issue →</Link>
              </p>
            </div>
          ) : (
            reports.map(r => <ComplaintCard key={r._id} complaint={r} />)
          )}
        </div>

      </div>
    </div>
  );
};

export default Dashboard;