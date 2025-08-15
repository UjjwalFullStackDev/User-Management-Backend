const express = require('express');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const {updateProfile, verifyEmail} = require('../controllers/userController');

const router = express.Router()

router.patch("/profile", auth, upload.single("profileImage"), updateProfile)
router.get("/verify-email/:token", verifyEmail)

module.exports = router;
