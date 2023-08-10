const mongoose = require('mongoose');
const db= require('../config/DBConnection');
const { Schema } = mongoose;

const messageSchema = new Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User', 
      required: true
    },
    content: {
      type: String,
      required: true
    },
    mediaPath: {
      type: String,
      default:""
    },
    receiverId: {
      type: Schema.Types.ObjectId,
      ref: 'User', 
      required: true
    },
    chatId: {
      type: Schema.Types.ObjectId,
      ref: 'Chat' 
    },
    deleted: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
  }],
  },
  {
    timestamps: true
  }
);

const MessageM = db.model('Message', messageSchema);

module.exports = MessageM;
