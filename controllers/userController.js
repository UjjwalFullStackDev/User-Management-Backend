const User = require("../models/user");
const { verifyToken } = require("../utils/jwt");
const EmailVerificationToken = require('../models/EmailVerificationToken')

const updateProfile = async (req, res) => {
  try {
    const updates = req.body;
    const allowedUpdates = ["name"];
    const filteredUpdates = {};

    for (let key of allowedUpdates) {
      if (updates[key] !== undefined) {
        filteredUpdates[key] = updates[key];
      }
    }

    if (req.file) {
      filteredUpdates.profileImage = `/uploads/${req.file.filename}`;
    }

    if (Object.keys(filteredUpdates).length === 0) {
      return res.status(400).json({ message: "No valid fields to update" });
    }

    await User.update(filteredUpdates, {
      where: { id: req.user.id },
    });

    const updatedUser = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password"] },
    });

    res.status(200).json({ message: "Fields update sucessfully", updatedUser });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error update fiels", error: error.message });
  }
};

// Email verification
const verifyEmail = async (req, res) => {
  const { token } = req.params;

  try {
    const tokenRecord = await EmailVerificationToken.findOne({
      where: { token },
    });

    if (!tokenRecord) return res.status(400).send("Invalid token");
    if (tokenRecord.expires_at < new Date()) {
      return res.status(400).send("Token expired");
    }

    await User.update(
      { is_verified: true },
      { where: { id: tokenRecord.user_id } }
    );

    await EmailVerificationToken.destroy({ where: { id: tokenRecord.id } });

    res.status(200).json({ message: "Email verified successfully!" });
  } catch (error) {
    res.status(400).send("Invalid or expired link");
  }
};

module.exports = { updateProfile, verifyEmail };
