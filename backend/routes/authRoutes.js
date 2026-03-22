const router = require('express').Router();
const { register, login, updateProfile, updateProfilePicture, changePassword } = require('../controllers/authController');
const { verifyToken } = require('../middleware/auth');
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
  const filetypes = /jpg|jpeg|png|webp|avif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);
  if (extname && mimetype) return cb(null, true);
  cb('Images only!');
};

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) { checkFileType(file, cb); },
});

router.post('/register', register);
router.post('/login', login);
router.put('/profile', verifyToken, updateProfile);
router.put('/profile-picture', verifyToken, upload.single('image'), updateProfilePicture);
router.put('/password', verifyToken, changePassword);

module.exports = router;
