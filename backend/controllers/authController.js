const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateResponsePayload = (user) => {
  return { id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin, firstName: user.firstName, lastName: user.lastName, dob: user.dob, profilePicture: user.profilePicture };
};

// POST /api/auth/register
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ message: "User already exists" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({ name, email, password: hashedPassword });
        const savedUser = await newUser.save();

        const token = jwt.sign({ id: savedUser._id, isAdmin: savedUser.isAdmin }, 'supersecretkey123', { expiresIn: '1d' });
        res.json({ token, user: generateResponsePayload(savedUser) });
    } catch (err) {
        res.status(500).json({ message: "Error registering user" });
    }
};

// POST /api/auth/login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, 'supersecretkey123', { expiresIn: '1d' });
        res.json({ token, user: generateResponsePayload(user) });
    } catch (err) {
        res.status(500).json({ message: "Error logging in" });
    }
};

// PUT /api/auth/profile
const updateProfile = async (req, res) => {
    try {
        const { firstName, lastName, dob, name } = req.body;
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        if (name !== undefined) user.name = name;
        if (firstName !== undefined) user.firstName = firstName;
        if (lastName !== undefined) user.lastName = lastName;
        if (dob !== undefined) user.dob = dob;

        await user.save();
        res.json({ message: "Profile updated", user: generateResponsePayload(user) });
    } catch (err) {
        res.status(500).json({ message: "Error updating profile" });
    }
};

// PUT /api/auth/profile-picture
const updateProfilePicture = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: "No file uploaded" });
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        const finalPath = `/${req.file.path.replace(/\\/g, '/')}`;
        user.profilePicture = finalPath;
        await user.save();
        res.json({ message: "Profile picture updated", user: generateResponsePayload(user) });
    } catch (err) {
        res.status(500).json({ message: "Error updating profile picture" });
    }
};

// PUT /api/auth/password
const changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) return res.status(400).json({ message: "Incorrect old password" });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        res.json({ message: "Password updated successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error changing password" });
    }
};

module.exports = { register, login, updateProfile, updateProfilePicture, changePassword };
