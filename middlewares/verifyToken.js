const UserM =require('../models/UserM');
const jwt= require('jsonwebtoken');
const mongoose= require('mongoose');



const verifyToken = (req, res, next) => {
  const authHeader = req.headers.token;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, "secretKey", async (err, user) => {
      if (err) {
        return res.status(403).json({ message: "Invalid Token" }); // Ajout du mot clé "return" ici pour éviter l'envoi multiple de réponses
      }
      req.user = user;
      next();
    });
  } else {
    return res.status(401).json("You are not authenticated"); // Ajout du mot clé "return" ici pour éviter l'envoi multiple de réponses
  }
};



const verifyAndAuth = (req, res, next) => {
  verifyToken(req, res, () => {
    // console.log("token id:", typeof req.user._id);
    // console.log("token id:", typeof req.params.id);

    const userId = req.user._id;
    const paramId = req.params.id;

    // console.log("test:",userId.trim()===paramId.trim());
    // console.log("id:", userId);
    // console.log("id:", paramId);
    if (userId.trim()===paramId.trim()) {
      next();
    } else {
      res.status(403).json("You can't access this");
    }
  });
};

const verifyForgetPwd = (req, res, next) => {
  verifyToken(req, res, () => {
    // console.log("token :",  req.user.code);
    const code = req.user.code;
    const paramCode = req.body.code;
    if (code.trim()===paramCode.trim()) {
      next();
    } else {
      res.status(403).json("invalid code");
    }
  });
};


module.exports={verifyToken,verifyAndAuth,verifyForgetPwd};