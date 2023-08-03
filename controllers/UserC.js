const UserM = require("../models/UserM");

exports.updateUser = async (req, res) => {
  // console.log(req);
  try {
    const {
      firstName,
      lastName,
      userName,
      email,
      phoneNumber,
      password,
      about,
      avatar,
      lastSeen,
      online,
      forgetPwd,
    } = req.body;

    const newUser = {
      firstName,
      lastName,
      userName,
      email,
      phoneNumber,
      password,
      about,
      avatar,
      lastSeen,
      online,
      forgetPwd,
    };

    await UserM.findByIdAndUpdate(req.params.id, newUser);

    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.updateAccount = async (req, res) => {
  // console.log(req);
  try {
    const {
      firstName,
      lastName,
      userName,
      email,
      phoneNumber,
      password,
      about,
      avatar,
      lastSeen,
      online,
      forgetPwd,
    } = req.body;

    const newUser = {
      firstName,
      lastName,
      userName,
      email,
      phoneNumber,
      password,
      about,
      avatar,
      lastSeen,
      online,
      forgetPwd,
    };

    await UserM.findByIdAndUpdate(req.user._id, newUser);

    res.status(200).json({ message: "Account updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await UserM.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.getUser = async (req, res) => {
  try {
    const user = await UserM.findByIdAndDelete(req.params.id);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.getAllUsers = async (req, res) => {
  try {
    const allUsers = await UserM.find();
    res.status(200).json(allUsers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addContactToUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const contactId = req.params.contactId;
    const user = await UserM.findById(userId);
    if (!user) {
      // throw new Error('User not found');
      res.status(404).json({ message: "User not found" });
    }

    const contact = await UserM.findById(contactId);
    console.log(contact);
    if (!contact) {
      // throw new Error('Contact not found');
      res.status(404).json({ message: "Contact not found" });
    } else {
      if (user.contacts) {
        user.contacts.push(contact);
        await user.save();
      } else {
        await user.updateOne({ contacts: [user] });
      }
    }

    res.status(200).json({ message: "Contact added successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.removeContactFromUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const contactId = req.params.contactId;
    const user = await UserM.findById(userId);
    if (!user) {
      // throw new Error('User not found');
      res.status(404).json({ message: "User not found" });
    }

    user.contacts = user.contacts.filter(
      (existingContact) => existingContact.toString() !== contactId
    );

    await user.save();

    res.status(200).json({ message: "Contact removed successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.blockContact = async (req, res) => {
  try {
    const userId = req.user._id;
    const contactId = req.params.contactId;
    const user = await UserM.findById(userId);
    if (!user) {
      // throw new Error('User not found');
      res.status(404).json({ message: "User not found" });
    }

    const contact = await UserM.findById(contactId);
    if (!contact) {
      // throw new Error('Contact not found');
      res.status(404).json({ message: "Contact not found" });
    }else {
      if (user.blackList) {
        user.blackList.push(contact);
        await user.save();
      } else {
        await user.updateOne({ blackList: [user] });
      }
    }

    res.status(200).json({ message: "Contact blocked successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.unblockContact = async (req, res) => {
  try {
    const userId = req.user._id;
    const contactId = req.params.contactId;
    const user = await UserM.findById(userId);
    if (!user) {
      // throw new Error('User not found');
      res.status(404).json({ message: "User not found" });
    }

    user.blackList = user.blackList.filter(
      (existingContact) => existingContact.toString() !== contactId
    );

    await user.save();

    res.status(200).json({ message: "Contact unblocked successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.getUserContacts = async (req, res) => {
  console.log(req.body);
  console.log(req.user._id);
  try {
    const userId = req.user._id;
    const contacts = await UserM.findById(userId).populate("contacts");
    console.log(contacts['contacts']);
    res.status(200).json(contacts['contacts']);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// var messages =await Message.find({chatId: req.params.id})
//          .populate("sender","username phoneNumber avatar")
//         // .populate('chatId')
//         //.sort({createdAt:-1})
//         .skip(skipMessages)
//         //.limit(pageSize);
//         messages=await UserM.populate(messages,{
//             path:"chatId.users",
//             select: "username phoneNumber avatar",
//         });