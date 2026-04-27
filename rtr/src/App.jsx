import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Layout/Navbar/Navbar";
import Footer from "./components/layout/Footer/Footer";
import ParticlesBackground from "./common/ParticlesBackground";
import ProtectedRoute from "./components/ProtectedRoute";

import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import DashboardPage from "./pages/DashboardPage";
import EventPage from "./pages/EventPage";
import MapviewPage from "./pages/MapviewPage";
import ReportIssuePage from "./pages/ReportIssuePage";
import AdminDashboard from "./pages/AdminDashboard";

import Login from "./components/auth/LoginForm/LoginForm";
import Register from "./components/auth/RegisterForm/RegisterForm";

// Admin protected route
const AdminRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  if (!token) return <Navigate to="/login" />;
  if (role !== "admin") return <Navigate to="/dashboard" />;
  return children;
};

function App() {
  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      <ParticlesBackground />
      <div style={{ position: "relative", zIndex: 1 }}>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/events" element={<EventPage />} />
          <Route path="/map" element={<MapviewPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/reportissue" element={<ProtectedRoute><ReportIssuePage /></ProtectedRoute>} />
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        </Routes>
        <Footer />
      </div>
    </div>
  );
}

export default App;