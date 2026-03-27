const router = require('express').Router();
const { register, login, updateProfile, updateProfilePicture, changePassword, requestOtp, deleteAccount } = require('../controllers/authController');
const { verifyToken } = require('../middleware/auth');
const rateLimit = require('express-rate-limit');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination(req, file, cb) { cb(null, 'uploads/'); },
  filename(req, file, cb) { cb(null, `avatar-${Date.now()}${path.extname(file.originalname)}`); }
});

const checkFileType = (file, cb) => {
  const filetypes = /jpg|jpeg|png|webp|avif|glb|gltf/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);
  if (extname && mimetype) return cb(null, true);
  cb('Images and 3D models only!');
};

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) { checkFileType(file, cb); },
});

// Rate limiters
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message: { message: 'Too many accounts created. Try again after an hour.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: { message: 'Too many login attempts. Please wait 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/register', registerLimiter, register);
router.post('/login', loginLimiter, login);
router.put('/profile', verifyToken, updateProfile);
router.put('/profile-picture', verifyToken, upload.single('image'), updateProfilePicture);
router.put('/password', verifyToken, changePassword);
router.post('/request-otp', verifyToken, requestOtp);
router.delete('/delete-account', verifyToken, deleteAccount);

module.exports = router;
