const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role, adminSecret } = req.body;

    const existingUser = await User.findOne({ email });
    if (role === "admin") {
      if (adminSecret !== process.env.ADMIN_SECRET) {
        return res.status(403).json({ message: "Invalid admin secret code" });
      }
    }
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: role || "user"
    });

    await user.save();
    res.status(201).json({ message: "User registered successfully" });

  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // Check if role matches
    if (role && user.role !== role) {
      return res.status(403).json({ message: `You are not registered as ${role}` });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token, role: user.role, name: user.name });

  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};