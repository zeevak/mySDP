// models/Message.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Message = sequelize.define(
  "message",
  {
    message_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    f_name: { 
      type: DataTypes.STRING(50), 
      allowNull: false 
    },
    l_name: { 
      type: DataTypes.STRING(50), 
      allowNull: false 
    },
    email: { 
      type: DataTypes.STRING(50), 
      allowNull: false 
    },
    phone_no: { 
      type: DataTypes.STRING(12) 
    },
    interested_in: { 
      type: DataTypes.STRING(50) 
    },
    message_text: { 
      type: DataTypes.TEXT, 
      allowNull: false 
    },
    is_read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    status: {
      type: DataTypes.STRING(20),
      defaultValue: 'new'
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  },
  {
    timestamps: false,
    tableName: 'message'
  }
);

module.exports = Message;