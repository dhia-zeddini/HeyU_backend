const ChatM = require("../models/ChatM");
const MessageM = require("../models/MessageM");
const Message = require("../models/MessageM");
const UserM = require("../models/UserM");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "./public/images/sharedMedia"), //Define where to store files
  filename: (req, file, cb) => {
    cb(null, Date.now() + ".jpeg");
  },
});
const upload = multer({
  storage: storage,
});
exports.getAllMessages = async (req, res) => {
  try {
    const pageSize = 12;
    const page = req.query.page || 1;

    const skipMessages = (page - 1) * pageSize;

    var messages = await Message.find({ chatId: req.params.id })
      .populate("sender", "username phoneNumber avatar")
      // .populate('chatId')
      //.sort({createdAt:-1})
      .skip(skipMessages);
    //.limit(pageSize);
    messages = await UserM.populate(messages, {
      path: "chatId.users",
      select: "username phoneNumber avatar",
    });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: "could not retrieve messages" });
  }
};

exports.sendMessage = async (req, res) => {
  const { content, chatId, receiverId } = req.body;
  console.log(req.body);
  if (!content || !chatId) {
    // console.log('invalid data');
    return res.status(400).json("invalid data");
  }
  var newMessage = {
    sender: req.user._id,
    content: content,
    receiverId: receiverId,
    chatId: chatId,
  };
  // console.log(newMessage);

  try {
    // console.log(newMessage)
    var message = new Message(newMessage);
    // console.log(message)
    await message.save();
    // console.log("message");
    message = await message.populate("sender", "username phoneNumber avatar");

    // message=await message.populate("chatId");
    message = await UserM.populate(message, {
      path: "chatId.users",
      select: "username phoneNumber avatar",
    });
    // console.log(message);
    await ChatM.findByIdAndUpdate(req.body.chatId, { messages: message });
    // console.log(message);
    res.json(message);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};
exports.sendImg = (req, res) => {
    console.log("test");
    try {
      console.log(req);
      res.json({ path: req.file.filename });
      console.log("working");
    } catch (e) {
      console.log(e);
      res.status(400).json({ error: e.message });
    }
  };

// exports.sendMessage = upload.single('media'), async (req, res) => {
//     const { content, chatId, receiverId } = req.body;
//     console.log(req.body);
//     // Access the uploaded image file using req.file
//     const uploadedImage = req.file;

//     console.log(req.body);

//     if (!content || !chatId) {
//         return res.status(400).json("invalid data");
//     }

//     var newMessage = {
//         sender: req.user._id,
//         content: content,
//         receiverId: receiverId,
//         chatId: chatId,
//         mediaPath: uploadedImage.path // Save the image file path
//     };

//     try {
//         var message = new Message(newMessage);
//         await message.save();
//         message = await message.populate("sender", "username phoneNumber avatar");
//         message = await UserM.populate(message, {
//             path: "chatId.users",
//             select: "username phoneNumber avatar",
//         });

//         await ChatM.findByIdAndUpdate(req.body.chatId, { messages: message });
//         res.json(message);
//     } catch (error) {
//         console.log(error);
//         res.status(400).json({ error: error.message });
//     }
// };

// exports.sendMessage = async (req, res) => {
//     try {
//       const { content, chatId, receiverId } = req.body;

//       if (!content || !chatId) {
//         console.log('Invalid data');
//         return res.status(400).json("Invalid data");
//       }

//       const newMessage = {
//         sender: req.user._id,
//         content,
//         receiverId,
//         chatId
//       };

//     //   const message = await Message.create(newMessage);
//     const message = await Message.create(newMessage, { wtimeout: 25000 });

//       await message.populate("sender", "username phoneNumber avatar").execPopulate();
//       await message.populate("chat").execPopulate();
//       await UserM.populate(message, {
//         path: "chat.users",
//         select: "username phoneNumber avatar"
//       });

//       await ChatM.findByIdAndUpdate(chatId, { $push: { messages: message._id } });

//       res.json(message);
//     } catch (error) {
//       console.log(error);
//       res.status(500).json({ error: "An error occurred" });
//     }
//   };

exports.deleteMsgForOne = async (req, res) => {
  try {
    const message = await MessageM.findOne({
      _id: req.params.id,
    });
    if (message) {
      const user = await UserM.findById(req.user._id);
      // console.log(user);
      if (!user) {
        res.status(404).json({ message: "user not found" });
      }
      if (message.deleted) {
        message.deleted.push(user);
        await message.save();
      } else {
        await message.updateOne({ deleted: [user] });
      }
      res.status(200).json({ message: "message deleted successfully" });
    } else {
      res.status(404).json({ message: "No such a user in any of the chats" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.removeMsgForAll = async (req, res) => {
  try {
    const message = await MessageM.findByIdAndUpdate(req.params.id, {
      chatId: null,
    });

    if (!message) {
      // throw new Error('message not found');
      res.status(404).json({ message: "message not found" });
    } else {
      res.status(200).json({ message: "message deleted for all" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
