const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');

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

// POST /api/auth/request-otp
const requestOtp = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        
        user.otpCode = otpCode;
        user.otpExpires = new Date(Date.now() + 10 * 60000); // 10 mins
        await user.save();

        const htmlTemplate = `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
            <div style="background-color: #ea580c; padding: 25px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 28px; letter-spacing: 2px; font-weight: 900;">MERN STORE</h1>
            </div>
            <div style="padding: 35px; background-color: #ffffff;">
                <h2 style="color: #1f2937; margin-top: 0; font-size: 22px;">Security Verification</h2>
                <p style="color: #4b5563; line-height: 1.6; font-size: 16px;">Hello,</p>
                <p style="color: #4b5563; line-height: 1.6; font-size: 16px;">You recently requested a secure action on your MERN Store account. Please use the following 6-digit verification code to securely authorize this request:</p>
                
                <div style="background-color: #fff7ed; border: 2px dashed #fdba74; border-radius: 8px; padding: 25px; text-align: center; margin: 35px 0;">
                    <span style="font-size: 38px; font-weight: 900; letter-spacing: 12px; color: #ea580c;">${otpCode}</span>
                </div>
                
                <p style="color: #4b5563; line-height: 1.6; font-size: 16px;">This code will automatically expire in exactly <strong>10 minutes</strong>. If you did not make this request, your account is perfectly safe and you may confidently ignore this email.</p>
                <p style="color: #4b5563; line-height: 1.6; font-size: 16px; margin-bottom: 0;">Warm regards,<br><strong style="color: #1f2937;">MERN Store Security Team</strong></p>
            </div>
            <div style="background-color: #f9fafb; padding: 25px; text-align: center; border-top: 1px solid #e5e7eb;">
                <p style="color: #6b7280; font-size: 13px; margin: 0; font-weight: 500;">&copy; ${new Date().getFullYear()} MERN Store. All rights reserved.</p>
                <p style="color: #6b7280; font-size: 13px; margin: 8px 0 0 0;">Need immediate help? Contact us instantly at <br> <a href="mailto:support@mernstore.com" style="color: #ea580c; text-decoration: none; font-weight: 600;">support@mernstore.com</a> | +1 (800) 123-4567</p>
            </div>
        </div>
        `;

        const emailSent = await sendEmail({
            to: user.email,
            subject: 'Your Security Verification Code - MERN Store',
            text: `Your verification code is: ${otpCode}. It will expire in 10 minutes.`,
            html: htmlTemplate
        });

        if (!emailSent) return res.status(500).json({ message: "Failed to send email. Check terminal for OTP (if local) or your SMTP settings." });

        res.json({ message: "OTP sent to your email" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error generating OTP" });
    }
};

// PUT /api/auth/password
const changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword, otpCode } = req.body;
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        if (!user.otpCode || user.otpCode !== otpCode) {
            return res.status(400).json({ message: "Invalid or missing OTP code" });
        }
        if (new Date() > user.otpExpires) {
            return res.status(400).json({ message: "OTP has expired. Please request a new one." });
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) return res.status(400).json({ message: "Incorrect old password" });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        
        user.otpCode = null;
        user.otpExpires = null;
        await user.save();

        res.json({ message: "Password updated successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error changing password" });
    }
};

// DELETE /api/auth/delete-account
const deleteAccount = async (req, res) => {
    try {
        const { otpCode } = req.body;
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        if (!user.otpCode || user.otpCode !== otpCode) {
            return res.status(400).json({ message: "Invalid or missing OTP code" });
        }
        if (new Date() > user.otpExpires) {
            return res.status(400).json({ message: "OTP has expired. Please request a new one." });
        }

        await User.findByIdAndDelete(user._id);
        res.json({ message: "Account successfully deleted" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting account" });
    }
};

module.exports = { register, login, updateProfile, updateProfilePicture, changePassword, requestOtp, deleteAccount };
