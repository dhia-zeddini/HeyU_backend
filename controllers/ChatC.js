const ChatM = require("../models/ChatM");
const UserM = require("../models/UserM");
const MessageM = require("../models/MessageM");

exports.accessChat = async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).send("user id is required");
  }
  reciver=await UserM.findById(userId);
  console.log(reciver);
  if(!reciver){
    return res.status(400).send("user dosn't exist");
  }else{

    var isChat = await ChatM.find({
      isGroupeChat: false,
      $and: [
        { users: { $elemMatch: { $eq: req.user._id } } },
        { users: { $elemMatch: { $eq: userId } } },
      ],
    });
    //   .populate("users", "-password")
    //   .populate("messages");
    // isChat = await UserM.populate(isChat, {
    //   path: "messages.sender",
    //   select: "username phoneNumber avatar",
    // });
    if (isChat.length > 0) {
      res.send(isChat[0]);
    } else {
      var chatData = {
        chatName: reciver.phoneNumber,
        isGroupeChat: false,
        users: [req.user._id, userId],
      };
  
      try {
        const createdChat = await ChatM.create(chatData);
        // const fullChat = await ChatM.findOne({ _id: createdChat._id }).populate(
        //   "users",
        //   "-password"
        // );
        res.status(200).json(createdChat);
      } catch (error) {
        res.status(400).json("faild to create chat");
      }
    }
  }
};

exports.getChat = async (req, res) => {
  // console.log("user chat:", req.user._id);
  try {
    results=ChatM.find({
      users: { $elemMatch: { $eq: req.user._id } },
      deleted: { $ne: req.user._id },
      archives: { $ne: req.user._id }
    })
      .populate("users", "-__V")
      .populate("messages")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await UserM.populate(results, {
          path: "messages.sender",
          select: "userName phoneNumber avatar",
        });
        res.status(200).json(results);
      });
  } catch (error) {
    res.status(500).json("faild to retrieve chat");
  }
};
// exports.getChat = async (req, res) => {
//   try {
//     const chats = await ChatM.find({
//       users: { $elemMatch: { $eq: req.user._id } },
//       deleted: { $ne: req.user._id },
//     })
//     .populate("users", "-password")
//     .populate("messages")
//     .populate("messages.sender", "username phoneNumber avatar")
//     .sort({ updatedAt: -1 });

//     res.status(200).json(chats);
//   } catch (error) {
//     res.status(500).json({ error: "Failed to retrieve chat" });
//   }
// };
exports.getArchive = async (req, res) => {
  try {
    ChatM.find({
      archives: { $elemMatch: { $eq: req.user._id } }
    })
      .populate("users", "-password")
      .populate("messages")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await UserM.populate(results, {
          path: "messages.sender",
          select: "userName phoneNumber avatar",
        });
        res.status(200).json(results);
      });
  } catch (error) {
    res.status(500).json("faild to retrieve chat");
  }
};
exports.getAllChats = async (req, res) => {
  try {
    const allUsers = await ChatM.find();
    res.status(200).json(allUsers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteChat = async (req, res) => {
  try {
    const chat = await ChatM.findOne({
      _id: req.params.id,
      $and: [{ users: { $elemMatch: { $eq: req.user._id } } }],
    });
    if (chat) {
      const user = await UserM.findById(req.user._id);
      // console.log(user);
      if (!user) {
        res.status(404).json({ message: "user not found" });
      }
      if (chat.deleted) {
        chat.deleted.push(user);
        await chat.save();
      } else {
        await chat.updateOne({ deleted: [user] });
      }
      res.status(200).json({ message: "Chat deleted successfully" });
    } else {
      res.status(404).json({ message: "No such a user in any of the chats" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.archiveChat = async (req, res) => {
  try {
    const chat = await ChatM.findOne({
      _id: req.params.id,
      $and: [{ users: { $elemMatch: { $eq: req.user._id } } }],
    });
    if (chat) {
      const user = await UserM.findById(req.user._id);
      // console.log(user);
      if (!user) {
        res.status(404).json({ message: "user not found" });
      }
      if (chat.archives) {
        chat.archives.push(user);
        await chat.save();
      } else {
        await chat.updateOne({ archives: [user] });
      }
      res.status(200).json({ message: "Chat archived successfully" });
    } else {
      res.status(404).json({ message: "No such a user in any of the chats" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.changeTheme=async(req, res) =>{
  try {
    const chat= await ChatM.findByIdAndUpdate(req.params.id,{theme:req.body.theme});
    
    if (!chat) {
      // throw new Error('chat not found');
    res.status(404).json({ message: "chat not found"});

    }else{
      res.status(200).json({ message: 'chat theme changed successfully' });
    }

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.changeWallpaper=async(req, res) =>{
  try {
    const chat= await ChatM.findByIdAndUpdate(req.params.id,{wallpapaer:req.body.wallpapaer});
    
    if (!chat) {
      // throw new Error('chat not found');
    res.status(404).json({ message: "chat not found"});

    }else{
      res.status(200).json({ message: 'chat wallpaper changed successfully' });
    }

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
