const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
    themeColor: {
        type: String,
        default: '#f57224' // Default MERNSTORE Orange
    },
    sliderImages: {
        type: [String],
        default: [
            '/hero-bg.png',
            '/hero-bg-2.png',
            '/hero-bg-3.png'
        ]
    }
}, { timestamps: true });

module.exports = mongoose.model('Settings', settingsSchema);
