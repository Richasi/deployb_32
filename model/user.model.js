
const mongoose = require("mongoose");

const userSchema = mongoose.Schema({

const mongoose = require("mongoose");

const userSchema = mongoose.Schema({

name: {type:String,required:true},

email: {type:String,required:true,unique:true},

gender:{type:String,required:true,enum:["Male","Female","Others"]},

password:{type:String,required:true},
age : {type:Number,required:true},
city : {type:String,required:true},

});

const UserModel = mongoose.model("user", userSchema); 
module.exports = { UserModel };
name: String,

email: String,

gender: String,

password: String,

});

const UserModel = mongoose.model("user", userSchema); 
module.exports = { UserModel };
