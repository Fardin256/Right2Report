import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../../api/auth";

const Register = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState("user");
  const [formData, setFormData] = useState({ name: "", email: "", password: "", confirmPassword: "", adminSecret: "" });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) { setError("Passwords do not match"); return; }
    setError("");
    setLoading(true);
    try {
      const response = await registerUser({ 
        name: formData.name, 
        email: formData.email, 
        password: formData.password, 
        role, 
        adminSecret: formData.adminSecret 
      });
      if (response.message === "User registered successfully") {
        setMessage(`✅ Registered as ${role} successfully! Redirecting to login...`);
        setFormData({ name: "", email: "", password: "", confirmPassword: "", adminSecret: "" });
        setTimeout(() => navigate("/login"), 2000);
      } else if (response.message === "Invalid admin secret code") {
        setError("❌ Invalid admin secret code. Access denied.");
      } else {
        setError(response.message || "Registration failed. Try again.");
      }
    } catch (err) {
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "linear-gradient(135deg, #4facfe, #00f2fe)" }}>
      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
        style={{ background: "#fff", padding: "40px", borderRadius: "16px", width: "380px", boxShadow: "0 10px 30px rgba(0,0,0,0.2)", textAlign: "center" }}>

        <h2 style={{ marginBottom: 6 }}>Create Account</h2>
        <p style={{ color: "#888", fontSize: 13, marginBottom: 24 }}>Join RTR and help improve your city</p>

        {/* Role Toggle */}
        <div style={{ display: "flex", background: "#f0f0f0", borderRadius: 10, padding: 4, marginBottom: 24 }}>
          {["user", "admin"].map((r) => (
            <motion.button key={r} type="button" onClick={() => { setRole(r); setError(""); setMessage(""); setFormData(f => ({ ...f, adminSecret: "" })); }}
              whileTap={{ scale: 0.97 }}
              style={{
                flex: 1, padding: "10px", borderRadius: 8, border: "none", cursor: "pointer", fontWeight: 600, fontSize: 14, transition: "all 0.2s",
                background: role === r ? "linear-gradient(135deg, #4facfe, #00f2fe)" : "transparent",
                color: role === r ? "white" : "#888"
              }}>
              {r === "user" ? "👤 User" : "⚙️ Admin"}
            </motion.button>
          ))}
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required
            style={{ padding: "12px", borderRadius: "8px", border: "1px solid #ddd", fontSize: "14px" }} />
          <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required
            style={{ padding: "12px", borderRadius: "8px", border: "1px solid #ddd", fontSize: "14px" }} />
          <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required
            style={{ padding: "12px", borderRadius: "8px", border: "1px solid #ddd", fontSize: "14px" }} />
          <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} required
            style={{ padding: "12px", borderRadius: "8px", border: "1px solid #ddd", fontSize: "14px" }} />

          {/* Admin Secret Code Field - only shows when admin tab is selected */}
          {role === "admin" && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
              <input
                type="password"
                name="adminSecret"
                placeholder="🔐 Enter Admin Secret Code"
                value={formData.adminSecret}
                onChange={handleChange}
                required
                style={{ padding: "12px", borderRadius: "8px", border: "1.5px solid #f39c12", fontSize: "14px", background: "#fffdf0", width: "100%", boxSizing: "border-box" }}
              />
              <p style={{ fontSize: 11, color: "#f39c12", margin: "4px 0 0", textAlign: "left" }}>
                ⚠️ Only authorized personnel can register as admin
              </p>
            </motion.div>
          )}

          {error && <p style={{ color: "red", fontSize: 13, margin: 0 }}>{error}</p>}
          {message && <p style={{ color: "green", fontSize: 13, margin: 0 }}>{message}</p>}

          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} type="submit" disabled={loading}
            style={{ padding: "13px", borderRadius: "8px", border: "none", background: "linear-gradient(135deg, #4facfe, #00f2fe)", color: "#fff", fontSize: "16px", cursor: "pointer", fontWeight: 600 }}>
            {loading ? "Registering..." : `Register as ${role === "admin" ? "Admin" : "User"}`}
          </motion.button>
        </form>

        <p style={{ marginTop: 16, fontSize: 14 }}>
          Already have an account? <Link to="/login" style={{ color: "#4facfe", fontWeight: "bold" }}>Login</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;