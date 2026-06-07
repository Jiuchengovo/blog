import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const generateToken = (userId) => {
  const secret = process.env.JWT_SECRET || "fallback-secret";
  const expiresIn = process.env.JWT_EXPIRES_IN || "7d";
  return jwt.sign({ userId }, secret, { expiresIn });
};

export const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) {
      const field = existing.email === email ? "email" : "username";
      return res.status(409).json({ message: `This ${field} is already taken` });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({ username, email, password: hashedPassword });

    const token = generateToken(user._id);

    res.status(201).json({
      token,
      user: { id: user._id, username: user.username, email: user.email, avatar: user.avatar },
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user._id);

    res.json({
      token,
      user: { id: user._id, username: user.username, email: user.email, avatar: user.avatar },
    });
  } catch (err) {
    next(err);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ user: { id: user._id, username: user.username, email: user.email, avatar: user.avatar, bio: user.bio } });
  } catch (err) {
    next(err);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { username, bio, avatar } = req.body;

    // Check username uniqueness if changing
    if (username) {
      const existing = await User.findOne({ username, _id: { $ne: req.user.id } });
      if (existing) {
        return res.status(409).json({ message: "This username is already taken" });
      }
    }

    const updates = {};
    if (username !== undefined) updates.username = username;
    if (bio !== undefined) updates.bio = bio;
    if (avatar !== undefined) updates.avatar = avatar;

    const user = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      user: { id: user._id, username: user.username, email: user.email, avatar: user.avatar, bio: user.bio },
    });
  } catch (err) {
    next(err);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Current and new password are required" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters" });
    }

    const user = await User.findById(req.user.id).select("+password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    user.password = await bcrypt.hash(newPassword, 12);
    await user.save();

    res.json({ message: "Password updated" });
  } catch (err) {
    next(err);
  }
};
