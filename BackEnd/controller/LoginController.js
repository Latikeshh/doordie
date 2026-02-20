const User = require("../models/LoginModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/* SIGNUP */
exports.signup = async (req, res) => {
  const { name, email, username, password } = req.body;

  try {
    // Check if email or username already exists
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      username,
      password: hashedPassword
    });

    res.status(201).json({ message: "Signup successful" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};


/* LOGIN (using email OR username) */
exports.login = async (req, res) => {
  const { email, username, password } = req.body;

  try {
    const user = await User.findOne({
      $or: [{ email }, { username }],
      isDeleted: false
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id, role: "user" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        username: user.username
      }
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};


/* GET ALL USERS */
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({ isDeleted: false })
      .select("-password")
      .sort({ createdAt: -1 });

    res.json(users);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* COUNT USERS */
exports.countUsers = async (req, res) => {
  try {
    const count = await User.countDocuments({ isDeleted: false });
    res.json({ totalUsers: count });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
/* FORGOT PASSWORD */
exports.forgotPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    const user = await User.findOne({ email, isDeleted: false });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    await user.save();

    res.json({ message: "Password reset successful" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* UPDATE USER */
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, username, password } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (username) user.username = username;

    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();

    res.json({ message: "User updated successfully" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};