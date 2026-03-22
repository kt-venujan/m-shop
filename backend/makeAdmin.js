const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config(); // 👈 This loads the secret notes

const DB_URL = process.env.MONGODB_URI;

async function makeAdmin(email) {
    try {
        await mongoose.connect(DB_URL);
        console.log("Connected to DB...");
        let user = await User.findOne({ email });
        
        if (!user) {
            console.log(`User not found: Auto-creating ${email} with password 'admin123'...`);
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('admin123', salt);
            
            user = new User({
                name: "System Admin",
                email: email,
                password: hashedPassword,
                isAdmin: true
            });
            await user.save();
            console.log(`✅ ${email} has been created and is now an Admin! (Password: admin123)`);
        } else {
            user.isAdmin = true;
            await user.save();
            console.log(`✅ ${email} is now an Admin!`);
        }
        process.exit(0);
    } catch (err) {
        console.error("Error:", err);
        process.exit(1);
    }
}

const email = process.argv[2];
if (!email) {
    console.log("Usage: node makeAdmin.js your@email.com");
    process.exit(1);
}
makeAdmin(email);
