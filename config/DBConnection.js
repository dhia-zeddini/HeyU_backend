require('dotenv').config();
const mongoose= require('mongoose');

const MONGO_URL=process.env.MONGO_URL;
const databaseName = 'heyU';
const connection = mongoose.createConnection(MONGO_URL).on('open',()=>{

    console.log("Mongo connected");
}).on('error',()=>{
    console.log("Mongo connection error");
});
module.exports=connection;