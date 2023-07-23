const mongoose= require('mongoose');
const db= require('../config/DBConnection');
const bcrypt=require("bcrypt");
const {Schema}=mongoose;

const chatSchema = new Schema(
    {
        chatName: {
            type: String,
            required: true
        },
        isGroupeChat: {
            type: Boolean,
            default: false
        },
        archives: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
        deleted: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
        theme: {
            type: String,
            default:""
            
        },
        wallpapaer: {
            type: String,
            default:""
            
        },
        
        users: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
          }],
        messages: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Message'
          }]
    },
    {
        timestamps: true
    }
);

const ChatM=db.model('Chat', chatSchema);
module.exports=ChatM;
