import React from "react";
import { motion } from "framer-motion";
import {
  FaInstagram,
  FaFacebookF,
  FaXTwitter,
  FaYoutube,
  FaGoogle,
  FaLocationDot,
  FaEnvelope,
} from "react-icons/fa6";
import Navbar from "../components/layout/Navbar/Navbar";

const ContactPage = () => {
  return (<> 
    
    <div style={styles.page}>
      <motion.div
        style={styles.card}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 style={styles.title}>Contact Us</h1>

        {/* Address */}
        <div style={styles.infoBox}>
          <FaLocationDot size={22} />
          <p>Mahrauli, South West Delhi, India</p>
        </div>

        {/* Email */}
        <div style={styles.infoBox}>
          <FaEnvelope size={22} />
          <p>rtr@gmail.com</p>
        </div>

        <h3 style={{ marginTop: "30px" }}>Follow Us</h3>

        {/* Social Icons */}
        <div style={styles.socialContainer}>
          <SocialIcon Icon={FaInstagram} color="#E1306C" />
          <SocialIcon Icon={FaFacebookF} color="#1877F2" />
          <SocialIcon Icon={FaXTwitter} color="#000000" />
          <SocialIcon Icon={FaYoutube} color="#FF0000" />
          <SocialIcon Icon={FaGoogle} color="#DB4437" />
        </div>
      </motion.div>
    </div> 
    </>
  );
};

const SocialIcon = ({ Icon, color }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.2 }}
      style={{
        ...styles.iconBox,
        color: color,
        borderColor: color,
      }}
      className="social-icon"
    >
      <Icon size={24} />
    </motion.div>
  );
};

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "transparent",
    padding: "20px",
  },
  card: {
    background: "#ffffff",
    padding: "40px",
    borderRadius: "16px",
    width: "100%",
    maxWidth: "500px",
    textAlign: "center",
    boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
  },
  title: {
    marginBottom: "25px",
    fontWeight: "700",
  },
  infoBox: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    justifyContent: "center",
    marginBottom: "15px",
    fontSize: "16px",
  },
  socialContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    marginTop: "20px",
  },
  iconBox: {
    width: "55px",
    height: "55px",
    borderRadius: "50%",
    border: "2px solid",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    transition: "0.3s ease",
    boxShadow: "0 0 0px transparent",
  },
};

export default ContactPage;