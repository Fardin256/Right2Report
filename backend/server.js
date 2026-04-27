const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const complaintRoutes = require("./routes/complaintRoutes");

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));
app.use(express.json());
app.use((req, res, next) => {
  console.log("INCOMING:", req.method, req.url);
  next();
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/complaint", complaintRoutes);

app.get("/", (req, res) => res.send("RTR Backend is running ✅"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));