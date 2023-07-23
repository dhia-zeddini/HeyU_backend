const router =require('express').Router() ;
const MessageController =require("../controllers/MessageC") ;
const {verifyToken,verifyAndAuth}=require('../middlewares/verifyToken');


router.post('/',verifyToken,MessageController.sendMessage);
router.get('/:id',verifyToken,MessageController.getAllMessages);
router.put('/:id',verifyToken,MessageController.deleteMsgForOne);
router.put('/removeMsg/:id',verifyToken,MessageController.removeMsgForAll);

module.exports= router;