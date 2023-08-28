
const router =require('express').Router() ;
const authController=require('../controllers/authC');
const {verifyForgetPwd}=require('../middlewares/verifyToken');
const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "./public/images/avatars"), //Define where to store files
  filename: (req, file, cb) => {
    cb(null, req.body["phoneNumber"]+Date.now()+ ".jpeg");
  },
});
const upload = multer({
  storage: storage,
});


router.post('/registration',upload.single("img"),authController.register);
router.post('/login',authController.login);
router.post('/forgetPwd',authController.forgetPwd);
router.post('/newPwd',verifyForgetPwd,authController.newPwd);

module.exports= router;
