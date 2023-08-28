const router = require("express").Router();
const MessageController = require("../controllers/MessageC");
const { verifyToken, verifyAndAuth } = require("../middlewares/verifyToken");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "./public/images/sharedMedia"), //Define where to store files
  filename: (req, file, cb) => {
    cb(null, req.body["chatId"]+Date.now()+ ".jpeg");
  },
});
const upload = multer({
  storage: storage,
});

router.post("/", verifyToken, upload.single("img"),MessageController.sendMessage);
router.post("/addImg", upload.single("img"), MessageController.sendImg);
router.get("/:id", verifyToken, MessageController.getAllMessages);
router.put("/:id", verifyToken, MessageController.deleteMsgForOne);
router.put("/removeMsg/:id", verifyToken, MessageController.removeMsgForAll);

module.exports = router;

