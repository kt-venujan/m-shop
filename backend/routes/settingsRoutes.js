const express = require('express');
const router = express.Router();
const { getSettings, updateSettings } = require('../controllers/settingsController');
const { verifyAdmin } = require('../middleware/auth');

router.get('/', getSettings);
router.put('/', verifyAdmin, updateSettings);

module.exports = router;
