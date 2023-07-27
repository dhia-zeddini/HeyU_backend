const mongoose = require("mongoose");
const db = require("../config/DBConnection");
const bcrypt = require("bcrypt");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    about: {
      type: String,
      default: "",
    },
    avatar: {
      type: String,
      required: true,
    },
    lastSeen: {
      type: Date,
      
    },
    online: {
      type: Boolean,
      
    },
    forgetPwd: {
      type: String,
      
    },
    contacts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    blackList: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
   
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function () {
  try {
    var user = this;
    const salt = await bcrypt.genSalt(10);
    const hashpass = await bcrypt.hash(user.password, salt);
    user.password = hashpass;
  } catch (error) {
    throw error;
  }
});
userSchema.pre("findOneAndUpdate", async function () {
  try {
    if (this._update.password) {
      const salt = await bcrypt.genSalt(10);
      const hashpass = await bcrypt.hash(this._update.password, salt);
      this._update.password = hashpass;
    }
  } catch (error) {
    throw error;
  }
});

const UserM = db.model("User", userSchema);
module.exports = UserM;
