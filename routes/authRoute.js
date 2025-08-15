const express = require('express')
const {register, login, updatePassword, forgetPassword, resetPassword} = require('../controllers/authController');
const auth = require('../middleware/auth');

const router = express.Router()

router.post('/signup', register);
router.post('/signin', login);
router.patch('/update-password', auth, updatePassword);
router.post('/forget-password', forgetPassword);
router.patch('/reset-password/:token', resetPassword);

module.exports = router;