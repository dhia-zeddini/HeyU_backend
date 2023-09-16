const UserM = require("../models/UserM");
const UserService = require("../services/UserS");
const nodemailer = require("nodemailer");
const {html}=require("../utils/mailTemplate");
let testaccount = nodemailer.createTestAccount();
const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  secure: false,
  auth: {
    // TODO: replace `user` and `pass` values from <https://forwardemail.net>
    user: "953442e4512364",
    pass: "6f65e90db3f543",
  },
});

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
      req.file?.filename,
      lastSeen,
      online,
      forgetPwd
    );
    res.json({ status: true, success: "User Registered" });
  } catch (error) {
    if (error.keyPattern) {
      console.log("Error", error);
      res.status(403).json({
        status: false,
        error: Object.keys(error.keyPattern)[0] + " already used",
      });
    } else {
      console.log("err", error);
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
      res.status(401).json("Invalid passworddd");
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
      const tokenData = {
        _id: user._id,
        email: user.email,
        code: user.forgetPwd,
      };
      const token = await UserService.generateToken(
        tokenData,
        "secretKey",
        "5h"
      );
       await transporter
        .sendMail({
          from: '"HeyU 👻" <heyU@example.com>', // sender address
          to: user.email, // list of receivers
          subject: "Reset your password", // Subject line
          //text: html, // plain text body
          html: "<h1><strong>Hi! dhia</strong></h1><h3>We have received a request to reset your password.</h3>Verification code:"+random, 
        })
        .then(() => {
          console.log("Message sent: %s");
          console.log("html",html);
        })
        .catch((error) => {
          console.log(error);
        });

      res
        .status(200)
        .json({ status: true, token: token });
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
