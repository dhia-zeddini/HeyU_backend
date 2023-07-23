const UserM = require("../models/UserM");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

async function registerUser(
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
) {
  try {
    const createUser = new UserM({
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
    });
    return await createUser.save();
  } catch (err) {
    throw err;
  }
}

async function checkuser(phoneNumber) {
  try {
    return await UserM.findOne({ phoneNumber });
  } catch (error) {
    throw error;
  }
}
//to utils
async function generateToken(tokenData, secretKey, jwt_expire) {
  return jwt.sign(tokenData, secretKey, { expiresIn: jwt_expire });
}

async function comparePassword(password, hashedPassword) {
  try {
    const isMatch = await bcrypt.compare(password, hashedPassword);
    console.log("oldpwd", hashedPassword);
    console.log("new", password);
    return isMatch;
  } catch (error) {
    throw error;
  }
}

async function generateCode() {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let code = "";
  const codeLength = 6;

  for (let i = 0; i < codeLength; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters[randomIndex];
  }

  return code;
}

module.exports = { comparePassword, generateToken, checkuser, registerUser,generateCode };
