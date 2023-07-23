const UserM = require("../models/UserM");
const UserService = require("../services/UserS");

exports.register = async (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
      userName,
      email,
      phoneNumber,
      password,
      about,
      avatar,
      lastSeen,
      online,
      forgetPwd,
    } = req.body;
    const succRes = await UserService.registerUser(
      firstName,
      lastName,
      userName,
      email,
      phoneNumber,
      password,
      about,
      avatar,
      lastSeen,
      online,
      forgetPwd
    );
    res.json({ status: true, success: "User Registered" });
  } catch (error) {
    if (error.keyPattern) {
      res.status(403).json({
        status: false,
        error: Object.keys(error.keyPattern)[0] + " already used",
      });
    } else {
      res.status(500).json({ status: false, error: "Internal Server Error" });
    }
  }
};

exports.login = async (req, res, next) => {
  try {
    const { phoneNumber, password } = req.body;
    const user = await UserService.checkuser(phoneNumber);
    if (!user) {
      // throw new Error('User does not exist');
      res.status(401).json("user dose not exist");
    }
    const isMatch = await UserService.comparePassword(password, user.password);

    if (isMatch === false) {
      // throw new Error('Invalid password');
      res.status(401).json("Invalid password");
    }

    const tokenData = { _id: user._id, phoneNumber: user.phoneNumber };
    const token = await UserService.generateToken(tokenData, "secretKey", "5h");
    res.status(200).json({ status: true, token: token });
    // res.status(200).json(user);
  } catch (error) {
    next(error);
    res.status(500);
  }
};

exports.forgetPwd = async (req, res) => {
  try {
    const random = await UserService.generateCode();
    const user = await UserM.findOne({
      $or: [
        {
          email: req.body.data,
        },
        {
          phoneNumber: req.body.data,
        },
      ],
    });
    if (!user) {
      res.status(404).json({ message: "user not found" });
    } else {
      await user.updateOne({ forgetPwd: random });
      const tokenData = { _id: user._id, phoneNumber: user.phoneNumber,code:user.forgetPwd };
      const token = await UserService.generateToken(
        tokenData,
        "secretKey",
        "5h"
      );
      res.status(200).json({ message: "code generated successfully", token: token });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.newPwd = async (req, res) => {
  try {
    if (req.body.newPwd !== req.body.confirmPwd) {
      res.status(403).json({ message: "You have to confirm your password" });
    } else {
      const user = await UserM.findOneAndUpdate(
        { _id: req.user._id }, 
        { password: req.body.newPwd }, 
        { new: true } 
      );
      if (!user) {
        res.status(404).json({ message: "User not found" });
      } else {
        res.status(200).json({ message: "Password updated successfully" });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

