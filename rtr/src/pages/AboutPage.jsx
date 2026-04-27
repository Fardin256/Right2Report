import React from "react";
import Navbar from "../components/Layout/Navbar/Navbar";
import { motion } from "framer-motion";
import {
  FaCamera,
  FaBuilding,
  FaPhoneAlt,
  FaNetworkWired,
  FaChartBar,
} from "react-icons/fa";
import "./CSSfiles/About.css";

const steps = [
  {
    title: "Re-Report",
    description:
      "Citizens upload photos of damaged public property and system detects location and issue type.",
    icon: <FaCamera />,
  },
  {
    title: "Re-Direct",
    description:
      "Platform auto-identifies responsible authority like MCD, PWD, DJB and provides official contact details.",
    icon: <FaBuilding />,
  },
  {
    title: "Re-Connect",
    description:
      "Users can call, email or access complaint links directly from website.",
    icon: <FaPhoneAlt />,
  },
  {
    title: "Scale Impact",
    description:
      "Issues are published on public feed and social media to increase transparency.",
    icon: <FaNetworkWired />,
  },
  {
    title: "Sustain Change",
    description:
      "Data dashboard tracks complaints and builds accountable civic ecosystem.",
    icon: <FaChartBar />,
  },
];

export default function About() {
  return (
    <div>
     

      <section className="about-container">
        <motion.h1
          className="about-title"
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Our Civic Impact Model
        </motion.h1>

        <div className="steps-container">
          {steps.map((step, index) => (
            <motion.div
              className="step-card"
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <div className="icon-wrapper">{step.icon}</div>
              <h2>{step.title}</h2>
              <p>{step.description}</p>

              {/* Image placeholder (replace with your image path) */}
              <img
                src={`/images/step${index + 1}.png`}
                alt={step.title}
                className="step-image"
              />
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}