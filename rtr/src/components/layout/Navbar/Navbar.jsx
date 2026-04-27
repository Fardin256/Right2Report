import React from "react";
import "./Navbar.css";
import logo from "../../../assets/logo.png";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Navbar() {

  const containerVariants = {
    hidden: { y: -80, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: -20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.4 }
    }
  };

  return (
    <motion.nav
      className="navbar"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >

      {/* Top Header */}
      <div className="headertop">
        <Link to="/login">Login</Link>
        <Link to="/register">Registration</Link>
        <Link to="/contact">Contact Us</Link>
        
      </div>

      {/* Main Navigation */}
      <div className="navigations">

        <motion.img
          src={logo}
          alt="Logo"
          className="logo"
          whileHover={{ scale: 1.08 }}
        />

        <div className="nav-links">

          <motion.div variants={itemVariants} whileHover={{ y: -3 }}>
            <Link to="/" className="nav-link">Home</Link>
          </motion.div>

          <motion.div variants={itemVariants} whileHover={{ y: -3 }}>
            <Link to="/about" className="nav-link">About</Link>
          </motion.div>

          <motion.div variants={itemVariants} whileHover={{ y: -3 }}>
            <Link to="/reportissue" className="nav-link">Report Issue</Link>
          </motion.div>

          <motion.div variants={itemVariants} whileHover={{ y: -3 }}>
            <Link to="/dashboard" className="nav-link">Dashboard</Link>
          </motion.div>

          <motion.div variants={itemVariants} whileHover={{ y: -3 }}>
            <Link to="/map" className="nav-link">Map View</Link>
          </motion.div>

        </div>

      </div>

    </motion.nav>
  );
}
















// import React from "react";
// import "./Navbar.css";
// import { AiFillApple } from "react-icons/ai";
// import logo from "../../../assets/logo.png";
// import { Link } from "react-router-dom";
// import { motion } from "framer-motion";

// export default function Navbar() {
//   const containerVariants = {
//     hidden: { y: -80, opacity: 0 },
//     visible: {
//       y: 0,
//       opacity: 1,
//       transition: {
//         duration: 0.6,
//         ease: "easeOut",
//         when: "beforeChildren",
//         staggerChildren: 0.1,
//       },
//     },
//   };

//   const itemVariants = {
//     hidden: { y: -20, opacity: 0 },
//     visible: {
//       y: 0,
//       opacity: 1,
//       transition: { duration: 0.4 },
//     },
//   };

//   return (
//     <motion.nav
//       className="navbar"
//       variants={containerVariants}
//       initial="hidden"
//       animate="visible"
//     >
//       {/* Top Header */}
//       <div className="headertop">

//         <Link to="/login">Login</Link>
//         <Link to="/Register">Registration</Link>
//         <Link to="/contact">Contact Us</Link>

//         <AiFillApple size={18} />
//       </div>

//       {/* Main Navigation */}
//       <div className="navigations">
//         <motion.img
//           src={logo}
//           alt="Logo"
//           className="logo"
//           whileHover={{ scale: 1.08 }}
//           transition={{ type: "spring", stiffness: 300 }}
//         />

//         <motion.div className="nav-links">
//           {["Home", "About", "Report Issue", "Dashboard", "Map View"].map(
//             (item, index) => (
//               <motion.div
//                 key={index}
//                 variants={itemVariants}
//                 whileHover={{ y: -3 }}
//               >
//                 <Link
//                   to={
//                     item === "Home"
//                       ? "/"
//                       : `/${item.toLowerCase().replace(" ", "")}`
//                   }
//                   className="nav-link"
//                 >
//                   {item}
//                 </Link>
//               </motion.div>
//             )
//           )}
//         </motion.div>
//       </div>
//     </motion.nav>
//   );
// }











// // import React from 'react';
// // import "./Navbar.css";
// // import { AiFillApple } from "react-icons/ai";
// // import logo from "../../../assets/logo.png";
// // import { Link } from "react-router-dom";

// // export default function Navbar() {
// //   return (
// //     <nav>
// //       <div className="headertop">
// //         <Link to="/events">Events</Link>
// //         <Link to="/contact">Contact Us</Link>
// //         <AiFillApple />
// //       </div>

// //       <div className="navigations">
// //         <img src={logo} alt="Logo" className="logo" />

// //         <Link to="/">Home</Link>
// //         <Link to="/about">About</Link>
// //         <Link to="/report">Report Issue</Link>
// //         <Link to="/dashboard">Dashboard</Link>
// //         <Link to="/map">Map View</Link>
// //       </div>
// //     </nav>
// //   );
// // }















