import React from "react";
import { motion } from "framer-motion";
import flowImage from "../../../assets/flow.png"; 
import "./FlowSection.css";

export default function FlowSection() {
  return (
    <div className="flow-container">

      {/* Top Section */}
      <div className="top-section">

        <motion.div
          className="left-text"
          initial={{ x: -150, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <h2>The eGov Way</h2>
          <p>
            Our 5-Thread Approach to achieve exponential impact in public
            service delivery at speed and scale
          </p>
        </motion.div>

        <motion.div
          className="right-text"
          initial={{ x: 150, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <p>
            Designed to drive rapid and scalable transformation for Digital
            Public Infrastructure (DPIs).
          </p>
        </motion.div>

      </div>

      {/* Image From Bottom */}
      <motion.div
        className="flow-image"
        initial={{ y: 150, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.2 }}
        viewport={{ once: true }}
      >
        <img src={flowImage} alt="Flow Diagram" />
      </motion.div>

    </div>
  );
}