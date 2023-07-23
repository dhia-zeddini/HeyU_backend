require('dotenv').config();
const express =require('express') ;
const body_parser =require('body-parser') ;
const authRoute =require('./routes/authR') ;
const UserRoute =require('./routes/UserR') ;
const ChatRoute =require('./routes/ChatR') ;
const MessageRoute =require('./routes/MessageR') ;

const app = express();
const PORT= process.env.PORT || 9090;

app.use(body_parser.json());
app.use('/',authRoute);
app.use('/user',UserRoute);
app.use('/chats',ChatRoute);
app.use('/messages',MessageRoute);


app.get('/',(req,res)=>{
    res.send("hello ")
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
  });
module.exports= app;