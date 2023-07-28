require("dotenv").config();
const express = require("express");
const body_parser = require("body-parser");
const authRoute = require("./routes/authR");
const UserRoute = require("./routes/UserR");
const ChatRoute = require("./routes/ChatR");
const MessageRoute = require("./routes/MessageR");
const path = require("path");
const { Socket } = require("socket.io");

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

io.on("connection",(Socket)=>{
  console.log('a user connected');  

  Socket.on('setup',(userId)=>{
    Socket.join(userId);
    Socket.broadcast.emit('online-user',userId);
    console.log(userId);
  });

  Socket.on('typing',(room)=>{
    console.log("typing");
    console.log("room");
    Socket.to(room).emit('typing',room);
  });
  Socket.on('stop typing',(room)=>{
    console.log("stop typing");
    console.log("room");
    Socket.to(room).emit('stop typing',room);
  });

  Socket.on('join chat',(room)=>{
    Socket.join(room)
    console.log('user joined : '+room);
  });

  Socket.on('new message',(newMessageReceived)=>{
    var chat=newMessageReceived.chat;
    var room=chat._id;
    var sender=newMessageReceived.sender;
    if(!sender||sender._id){
      console.log("sender not defined");
      return;
    }
    var senderId=sender._id;
    console.log(senderId+"message sender");
    const users=chat.users;
    if(!users){
      console.log("users not defined");
      return;
    }
    Socket.to(room).emit('message recived',newMessageReceived);
    Socket.to(room).emit('message sent',"New Message");
  });

Socket.off('setup',()=>{
  console.log('user offline');
  Socket.leave(userId);
});


})

module.exports = app;
