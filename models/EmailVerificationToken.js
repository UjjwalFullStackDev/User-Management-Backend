const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const EmailVerificationToken = sequelize.define("EmailVerificationToken", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  token: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  expires_at: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: "email_verification_tokens",
  timestamps: false,
});

module.exports = EmailVerificationToken;
