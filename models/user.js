//npm i passport
//npm i passprt-local
//npm i passport-local-mongoose---- to using by this liberary 
//available additional function with mongodb as database

const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema=new Schema({
    email:{
        type:String,
        required:true
    },
});
userSchema.plugin(passportLocalMongoose);//You're free to define your User how you like. Passport-Local Mongoose will add a username, hash and salt field to store the username, the hashed password and the salt value.
module.exports=mongoose.model("user",userSchema);