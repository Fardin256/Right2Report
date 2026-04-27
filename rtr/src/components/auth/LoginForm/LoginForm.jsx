import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../../../api/auth";

const Login = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState("user");
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const savedRole = localStorage.getItem("role");
      navigate(savedRole === "admin" ? "/admin" : "/dashboard");
    }
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await loginUser({ ...formData, role });
      if (response.token) {
        setMessage("Login Successful ✅");
        navigate(response.role === "admin" ? "/admin" : "/dashboard");
      } else if (response.message === "You are not registered as admin") {
        setMessage("⚠️ You are not an admin. Please login as User.");
      } else if (response.message === "User not found") {
        setMessage("❌ User not found. Please register first.");
      } else if (response.message === "Invalid password") {
        setMessage("❌ Incorrect password. Try again.");
      } else {
        setMessage(response.message || "Login failed. Try again.");
      }
    } catch (error) {
      setMessage("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "linear-gradient(135deg, #667eea, #764ba2)" }}>
      <motion.div initial={{ opacity: 0, y: -40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
        style={{ background: "#fff", padding: "40px", borderRadius: "16px", width: "360px", boxShadow: "0 10px 30px rgba(0,0,0,0.2)", textAlign: "center" }}>

        <h2 style={{ marginBottom: 6 }}>Welcome Back</h2>
        <p style={{ color: "#888", fontSize: 13, marginBottom: 24 }}>Login to your RTR account</p>

        {/* Role Toggle */}
        <div style={{ display: "flex", background: "#f0f0f0", borderRadius: 10, padding: 4, marginBottom: 24 }}>
          {["user", "admin"].map((r) => (
            <motion.button key={r} type="button" onClick={() => { setRole(r); setMessage(""); }}
              whileTap={{ scale: 0.97 }}
              style={{
                flex: 1, padding: "10px", borderRadius: 8, border: "none", cursor: "pointer", fontWeight: 600, fontSize: 14, transition: "all 0.2s",
                background: role === r ? "linear-gradient(135deg, #667eea, #764ba2)" : "transparent",
                color: role === r ? "white" : "#888"
              }}>
              {r === "user" ? "👤 User" : "⚙️ Admin"}
            </motion.button>
          ))}
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <input type="email" name="email" placeholder="Email Address" value={formData.email}
            onChange={handleChange} required
            style={{ padding: "12px", borderRadius: "8px", border: "1px solid #ddd", fontSize: "14px" }} />

          <input type="password" name="password" placeholder="Password" value={formData.password}
            onChange={handleChange} required
            style={{ padding: "12px", borderRadius: "8px", border: "1px solid #ddd", fontSize: "14px" }} />

          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} type="submit" disabled={loading}
            style={{ padding: "13px", borderRadius: "8px", border: "none", background: "linear-gradient(135deg, #667eea, #764ba2)", color: "#fff", fontSize: "16px", cursor: "pointer", fontWeight: 600 }}>
            {loading ? "Logging in..." : `Login as ${role === "admin" ? "Admin" : "User"}`}
          </motion.button>
        </form>

        {message && (
          <p style={{ marginTop: 14, fontSize: 13, fontWeight: 500, color: message.includes("✅") ? "green" : "red" }}>
            {message}
          </p>
        )}

        <p style={{ marginTop: 16, fontSize: 13, color: "#888" }}>
          Don't have an account? <Link to="/register" style={{ color: "#667eea", fontWeight: 600 }}>Register</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;