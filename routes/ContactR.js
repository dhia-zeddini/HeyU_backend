const router =require('express').Router() ;
const UserController =require("../controllers/UserC") ;
const {verifyToken}=require('../middlewares/verifyToken');



router.get('/',verifyToken,UserController.getUserContacts);
module.exports=router;