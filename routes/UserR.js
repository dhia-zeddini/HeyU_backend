const router =require('express').Router() ;
const UserController =require("../controllers/UserC") ;
const {verifyToken,verifyAndAuth}=require('../middlewares/verifyToken');





router.put('/:id',verifyAndAuth,UserController.updateUser);
router.put('/',verifyToken,UserController.updateAccount);
router.delete('/:id',verifyAndAuth,UserController.deleteUser);
router.get('/profile',verifyToken,UserController.getUser);
router.get('/',UserController.getAllUsers);
router.put('/contacts/:contactId',verifyToken,UserController.addContactToUser);
router.delete('/removeContact/:contactId',verifyToken,UserController.removeContactFromUser);
router.put('/block/:contactId',verifyToken,UserController.blockContact);
router.delete('/unblock/:contactId',verifyToken,UserController.unblockContact);
module.exports= router;
