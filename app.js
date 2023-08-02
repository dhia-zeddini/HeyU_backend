require("dotenv").config();
const express = require("express");
const body_parser = require("body-parser");
const authRoute = require("./routes/authR");
const UserRoute = require("./routes/UserR");
const ChatRoute = require("./routes/ChatR");
const MessageRoute = require("./routes/MessageR");
const path = require("path");
const { Socket } = require("socket.io");
const { log } = require("console");

const app = express();
const PORT = process.env.PORT || 9090;

app.use(body_parser.json());
app.use("/", authRoute);
app.use("/user", UserRoute);
app.use("/chats", ChatRoute);
app.use("/messages", MessageRoute);
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.send("hello ");
});

const server = app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http:localhost:9000",
  },
});
var clients=[];
io.on("connection",(Socket)=>{
  console.log('a user connected '+Socket.id);  

  Socket.on('setup',(userId)=>{
    Socket.join(userId);
    Socket.broadcast.emit('online-user',userId);
    console.log(userId);
    clients[userId]=Socket;
    // console.log(clients);
  });

  Socket.on('typing',(receiverId)=>{
    console.log("typing");
    clients[receiverId].emit('typing',receiverId);
  });
  Socket.on('stop typing',(receiverId)=>{
    console.log("stop typing");
    clients[receiverId].emit('stop typing',receiverId);
  });

  Socket.on('join chat',(room)=>{
    Socket.join(room)
    console.log('user joined : '+room);
    // clients[room]=Socket;
    // console.log(clients[room]);
    // console.log(clients[room].rooms);
  });

  Socket.on('new message',(newMessageReceived)=>{
    var chat=newMessageReceived.chatId;
    var room=Socket.rooms;
    var sender=newMessageReceived.sender;
    if(!sender||sender._id){
      console.log("sender not defined");
      return;
    }
    var senderId=sender;
    let receiverId=newMessageReceived.receiverId;
    console.log(senderId+"message sender");
    // const users=chat.users;
    // if(!users){
    //   console.log("users not defined");
    //   return;
    // }
    // if(clients[chat]){
    //   clients[chat].emit('new message',newMessageReceived);
    // }
    console.log(clients[receiverId]);

    if (clients[receiverId] ) {
      clients[receiverId].emit('new message', newMessageReceived);
    } else {
      console.log(`Receiver ${receiverId} is not connected to the chat room ${chat}`);
    }
    // Socket.emit('new message',"New Message");
    console.log("new message "+room);
    console.log(newMessageReceived);
  });

Socket.off('setup',()=>{
  console.log('user offline');
  Socket.leave(userId);
});
Socket.on('disconnect', () => {
  console.log('user disconnected: ' + Socket.id);
  // Clean up disconnected users from the clients object
  for (const userId in clients) {
    if (clients[userId] === Socket) {
      delete clients[userId];
      console.log(`Client ${userId} removed from the clients list.`);
      break;
    }
  }
});

})

module.exports = app;
