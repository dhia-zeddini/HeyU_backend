const router =require('express').Router() ;
const ChatController =require("../controllers/ChatC") ;
const {verifyToken,verifyAndAuth}=require('../middlewares/verifyToken');

router.post('/',verifyToken,ChatController.accessChat);
router.get('/',verifyToken,ChatController.getChat);
router.get('/archive',verifyToken,ChatController.getArchive);
router.put('/:id',verifyToken,ChatController.deleteChat);
router.put('/archive/:id',verifyToken,ChatController.archiveChat);
router.put('/theme/:id',verifyToken,ChatController.changeTheme);
router.put('/wallpapaer/:id',verifyToken,ChatController.changeWallpaper);
router.get('/all',ChatController.getAllChats);

module.exports= router;