import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaCamera, FaMapMarkerAlt, FaShareAlt } from "react-icons/fa";

const slides = [
    {
        title: "Report Civic Issues Instantly",
        desc: "Capture damaged roads, streetlights or public infrastructure and send it directly to the responsible authority.",
        icon: <FaCamera />
    },
    {
        title: "Automatic Authority Mapping",
        desc: "RTR identifies the responsible government department based on location.",
        icon: <FaMapMarkerAlt />
    },
    {
        title: "Raise Awareness",
        desc: "Share your civic report on social media and help build public accountability.",
        icon: <FaShareAlt />
    }
];

export default function Hero() {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % slides.length);
        }, 4000);

        return () => clearInterval(interval);
    }, []);

    return (
        <section style={styles.hero}>

            {/* Background Gradient */}
            <div style={styles.overlay}></div>

            <div style={styles.container}>

                {/* Left Text Content */}
                <motion.div
                    initial={{ opacity: 0, x: -60 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1 }}
                    style={styles.left}
                >
                    <h1 style={styles.title}>
                        RTR <span style={{ color: "#4ADE80" }}>Right To Request</span>
                    </h1>

                    <p style={styles.subtitle}>
                        Empower citizens to report damaged public infrastructure and make
                        authorities accountable for faster civic solutions.
                    </p>

                    <div style={styles.buttons}>

                        <Link to="/reportissue" style={{ textDecoration: "none" }}>
                            <button style={styles.primaryBtn}>Report Issue</button>
                        </Link>

                        <Link to="/about" style={{ textDecoration: "none" }}>
                            <button style={styles.secondaryBtn}>Learn More</button>
                        </Link>

                    </div>
                </motion.div>

                {/* Carousel Section */}
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    style={styles.carousel}
                >
                    <div style={styles.card}>
                        <div style={styles.icon}>{slides[index].icon}</div>
                        <h3>{slides[index].title}</h3>
                        <p>{slides[index].desc}</p>
                    </div>
                </motion.div>

            </div>
        </section>
    );
}

const styles = {
    hero: {
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        background:
            "linear-gradient(135deg,#0f172a,#1e293b,#111827)",
        color: "white",
        overflow: "hidden"
    },

    overlay: {
        position: "absolute",
        width: "100%",
        height: "100%",
        background:
            "radial-gradient(circle at 20% 30%,rgba(34,197,94,0.2),transparent)"
    },

    container: {
        display: "flex",
        gap: "60px",
        alignItems: "center",
        maxWidth: "1200px",
        padding: "40px",
        zIndex: 2
    },

    left: {
        maxWidth: "500px"
    },

    title: {
        fontSize: "56px",
        fontWeight: "700",
        marginBottom: "20px"
    },

    subtitle: {
        fontSize: "18px",
        color: "#CBD5F5",
        lineHeight: "1.6",
        marginBottom: "30px"
    },

    buttons: {
        display: "flex",
        gap: "15px"
    },

    primaryBtn: {
        padding: "12px 26px",
        borderRadius: "30px",
        border: "none",
        background: "#22C55E",
        color: "white",
        fontWeight: "600",
        cursor: "pointer"
    },

    secondaryBtn: {
        padding: "12px 26px",
        borderRadius: "30px",
        border: "1px solid white",
        background: "transparent",
        color: "white",
        cursor: "pointer"
    },

    carousel: {
        width: "350px"
    },

    card: {
        padding: "30px",
        borderRadius: "20px",
        background: "rgba(255,255,255,0.08)",
        backdropFilter: "blur(10px)",
        textAlign: "center"
    },

    icon: {
        fontSize: "40px",
        marginBottom: "15px",
        color: "#22C55E"
    }
};