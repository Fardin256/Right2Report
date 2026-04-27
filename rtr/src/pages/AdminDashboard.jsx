import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { getAllComplaints, updateComplaintStatus, deleteComplaint } from "../api/complaints";
import { FaTrash, FaSignOutAlt, FaFilter, FaUser, FaMapPin, FaCalendarAlt } from "react-icons/fa";

const statusColors = {
  Pending: { bg: "#f8d7da", color: "#721c24", border: "#f5c6cb" },
  "In Progress": { bg: "#fff3cd", color: "#856404", border: "#ffeeba" },
  Resolved: { bg: "#d4edda", color: "#155724", border: "#c3e6cb" }
};

const issueIcon = (type) => {
  const icons = { garbage: "🗑️", road: "🛣️", pothole: "🕳️", water: "💧", electricity: "⚡", other: "📋" };
  return icons[type?.toLowerCase()] || "📋";
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterIssue, setFilterIssue] = useState("All");
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => { fetchAll(); }, []);

  useEffect(() => {
    let result = complaints;
    if (filterStatus !== "All") result = result.filter(c => c.status === filterStatus);
    if (filterIssue !== "All") result = result.filter(c => c.issueType === filterIssue);
    setFiltered(result);
  }, [filterStatus, filterIssue, complaints]);

  const fetchAll = async () => {
    setLoading(true);
    const data = await getAllComplaints();
    setComplaints(data.complaints || []);
    setFiltered(data.complaints || []);
    setLoading(false);
  };

  const handleStatusChange = async (id, status) => {
    await updateComplaintStatus(id, status);
    setComplaints(prev => prev.map(c => c._id === id ? { ...c, status } : c));
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this complaint?")) return;
    await deleteComplaint(id);
    setComplaints(prev => prev.filter(c => c._id !== id));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    navigate("/login");
  };

  const stats = {
    total: complaints.length,
    pending: complaints.filter(c => c.status === "Pending").length,
    inProgress: complaints.filter(c => c.status === "In Progress").length,
    resolved: complaints.filter(c => c.status === "Resolved").length
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f4f6fb", padding: "30px 20px" }}>
      <div style={{ maxWidth: 1000, margin: "auto" }}>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          style={{ background: "linear-gradient(135deg, #1a1a2e, #16213e)", borderRadius: 20, padding: "24px 30px", marginBottom: 28, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h2 style={{ margin: 0, color: "white", fontSize: 22 }}>⚙️ Admin Dashboard</h2>
            <p style={{ margin: "4px 0 0", color: "rgba(255,255,255,0.6)", fontSize: 13 }}>Manage all public complaints</p>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <motion.button whileHover={{ scale: 1.05 }} onClick={() => navigate("/dashboard")}
              style={{ padding: "10px 18px", borderRadius: 10, border: "2px solid rgba(255,255,255,0.3)", background: "transparent", color: "white", fontWeight: 600, cursor: "pointer", fontSize: 13 }}>
              👤 User View
            </motion.button>
            <motion.button whileHover={{ scale: 1.05 }} onClick={handleLogout}
              style={{ padding: "10px 18px", borderRadius: 10, border: "none", background: "#e74c3c", color: "white", fontWeight: 600, cursor: "pointer", fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}>
              <FaSignOutAlt /> Logout
            </motion.button>
          </div>
        </motion.div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 24 }}>
          {[
            { label: "Total", val: stats.total, color: "#667eea", bg: "#eef0ff" },
            { label: "Pending", val: stats.pending, color: "#e74c3c", bg: "#fdecea" },
            { label: "In Progress", val: stats.inProgress, color: "#f39c12", bg: "#fef9e7" },
            { label: "Resolved", val: stats.resolved, color: "#27ae60", bg: "#eafaf1" }
          ].map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              style={{ background: "white", borderRadius: 14, padding: "18px", textAlign: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
              <h2 style={{ margin: 0, fontSize: 30, fontWeight: 800, color: s.color }}>{s.val}</h2>
              <p style={{ margin: "4px 0 0", color: "#888", fontSize: 13 }}>{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <div style={{ background: "white", borderRadius: 14, padding: "16px 20px", marginBottom: 20, display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <FaFilter color="#667eea" />
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
            style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #ddd", fontSize: 13, cursor: "pointer" }}>
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
          <select value={filterIssue} onChange={e => setFilterIssue(e.target.value)}
            style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #ddd", fontSize: 13, cursor: "pointer" }}>
            <option value="All">All Issues</option>
            <option value="road">Road</option>
            <option value="garbage">Garbage</option>
            <option value="water">Water</option>
            <option value="electricity">Electricity</option>
            <option value="other">Other</option>
          </select>
          <span style={{ marginLeft: "auto", fontSize: 13, color: "#888" }}>Showing {filtered.length} complaints</span>
        </div>

        {/* Complaints List */}
        <div style={{ background: "white", borderRadius: 16, padding: 24, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          {loading ? (
            <div style={{ textAlign: "center", padding: 40, color: "#999" }}>⏳ Loading complaints...</div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: 40, color: "#bbb" }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
              <p>No complaints found</p>
            </div>
          ) : filtered.map(c => {
            const s = statusColors[c.status] || statusColors.Pending;
            const date = new Date(c.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
            const isOpen = expandedId === c._id;

            return (
              <motion.div key={c._id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                style={{ border: "1px solid #eee", borderRadius: 12, marginBottom: 14, overflow: "hidden" }}>

                {/* Row */}
                <div onClick={() => setExpandedId(isOpen ? null : c._id)}
                  style={{ padding: "16px 20px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ fontSize: 26 }}>{issueIcon(c.issueType)}</span>
                    <div>
                      <h4 style={{ margin: 0, textTransform: "capitalize", fontSize: 15 }}>{c.issueType || "General"}</h4>
                      <p style={{ margin: "3px 0 0", fontSize: 12, color: "#888", display: "flex", alignItems: "center", gap: 6 }}>
                        <FaUser size={10} /> {c.userId?.name || "Unknown"}
                        &nbsp;·&nbsp;
                        <FaMapPin size={10} /> {c.area || "N/A"}
                        &nbsp;·&nbsp;
                        <FaCalendarAlt size={10} /> {date}
                      </p>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600, background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>
                      {c.status}
                    </span>
                    <span style={{ color: "#bbb", fontSize: 16 }}>{isOpen ? "▲" : "▼"}</span>
                  </div>
                </div>

                {/* Expanded */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                      style={{ overflow: "hidden", borderTop: "1px solid #f0f0f0" }}>
                      <div style={{ padding: 20 }}>
                        {c.imageUrl && (
                          <img src={c.imageUrl} alt="issue" style={{ width: "100%", maxHeight: 200, objectFit: "cover", borderRadius: 10, marginBottom: 16 }} />
                        )}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
                          <div style={box}><span style={label}>👤 Reported By</span><span style={val}>{c.userId?.name || "N/A"}</span></div>
                          <div style={box}><span style={label}>📧 User Email</span><span style={val}>{c.userId?.email || "N/A"}</span></div>
                          <div style={box}><span style={label}>📝 Description</span><span style={val}>{c.description || "N/A"}</span></div>
                          <div style={box}><span style={label}>🏢 Department</span><span style={val}>{c.authorityName || "N/A"}</span></div>
                        </div>

                        {/* Status Update */}
                        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                          <span style={{ fontSize: 13, fontWeight: 600, color: "#555" }}>Update Status:</span>
                          {["Pending", "In Progress", "Resolved"].map(status => (
                            <motion.button key={status} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                              onClick={() => handleStatusChange(c._id, status)}
                              style={{
                                padding: "7px 16px", borderRadius: 8, cursor: "pointer", fontSize: 12, fontWeight: 600,
                                background: c.status === status ? statusColors[status].bg : "#f5f5f5",
                                color: c.status === status ? statusColors[status].color : "#888",
                                border: c.status === status ? `1px solid ${statusColors[status].border}` : "1px solid #eee"
                              }}>
                              {status}
                            </motion.button>
                          ))}
                          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                            onClick={() => handleDelete(c._id)}
                            style={{ marginLeft: "auto", padding: "7px 16px", borderRadius: 8, border: "none", background: "#fee2e2", color: "#dc2626", cursor: "pointer", fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
                            <FaTrash size={11} /> Delete
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const box = { background: "#f9f9f9", borderRadius: 8, padding: "10px 14px", display: "flex", flexDirection: "column", gap: 4 };
const label = { fontSize: 11, color: "#999", fontWeight: 600, textTransform: "uppercase" };
const val = { fontSize: 13, color: "#444", fontWeight: 500 };

export default AdminDashboard;