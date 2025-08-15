const User = require("../models/user");
const {generateToken, verifyToken} = require('../utils/jwt')
const jwt = require('jsonwebtoken');

// Registration
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    const checkEmail = await User.findOne({ where: { email } });
    if (checkEmail) {
      return res
        .status(400)
        .json({ message: "User already exist, Please login" });
    }

    const user = await User.create({ name, email, password });

    const token = generateToken(user.id)

    res.status(201).json({
      message: "User created successfully",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error registering user", error: error.message });
  }
};

// Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user.id)

    return res.status(200).json({
      message: "Login sucessfull",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error login user", error: error.message });
  }
};


// Update password
const updatePassword = async (req, res) => {
  try {
    const { id } = req.user;
  
    const { password, newPassword } = req.body;
    if(!password || ! newPassword) {
      return res.status(400).json({message: "To change password, please enter old password and new password."})
    }
  
    if (newPassword.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters long' });
      }
  
    const user = await User.findByPk(id)
    if (!user) {
        return res.status(400).json({ message: "User not found" });
      }
  
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(400).json({ message: "Incorrect password" });
      }
  
      user.password = newPassword
      await user.save();
  
      res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating password", error: error.message });
  }
  
}


// Forget password
const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if(!email) return res.status(400).json({message: "Email required"})
      
    const user = await User.findOne({ where: { email }})
    if(!user) return res.status(400).json({message: "Invalid email"})
  
    const resetToken = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: '10m'})
  
    res.status(200).json({
        message: "Password reset link generated",
        resetLink: `http://localhost:${process.env.PORT}/reset-password/${resetToken}`
      });
  
  } catch (error) {
    res.status(500).json({ message: "Error reset password", error: error.message });
  }
}


// Reset password
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;
    if(!newPassword) return res.status(400).json({message: "New password required"});

    const decoded = verifyToken(token)
    const user = await User.findByPk(decoded.id);

    if(!user) return res.status(404).json({message: "User not found"})
    
    user.password = newPassword;
    await user.save();
    
    res.status(200).json({message: "Password reset sucessfull"})
  } catch (error) {
    res.status(500).json({ message: "Invalid or expire token", error: error.message });
  }
}



module.exports = { register, login, updatePassword, forgetPassword, resetPassword };
