const UserM =require('../models/UserM');
const jwt= require('jsonwebtoken');
const mongoose= require('mongoose');



const verifyToken=(req,res,next)=>{
    const authHeader=req.headers.token;
    if(authHeader){
        const token=authHeader.split(' ')[1];
        jwt.verify(token,'secretKey',async(err,user)=>{
            if(err) res.status(403).json({message:"Invalid Token"});
            req.user=user;

            // console.log(user);
            next();
            
        });
    }else{
        return res.sendStatus(401).json("you are not authenticated");
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