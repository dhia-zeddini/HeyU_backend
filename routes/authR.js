
const router =require('express').Router() ;
const authController=require('../controllers/authC');
const {verifyForgetPwd}=require('../middlewares/verifyToken');

router.post('/registration',authController.register);
router.post('/login',authController.login);
router.post('/forgetPwd',authController.forgetPwd);
router.post('/newPwd',verifyForgetPwd,authController.newPwd);

module.exports= router;
