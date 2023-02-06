const mongoose=require("mongoose");

const userSchema=mongoose.Schema({
    name:String,
    email:String,
    password:String,
    role:String
},{
    versionKey:false
})

const userModel=mongoose.model("userinfo",userSchema);

module.exports={userModel}