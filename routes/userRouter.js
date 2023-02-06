const express=require("express");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
const {userModel}=require("../models/userModel");
const fs=require("fs");
require("dotenv").config();


const userRouter=express.Router();

userRouter.get("/",(req,res)=>{
    res.send("User Router working fine")
})




userRouter.post("/signup",(req,res)=>{
    let {name,email,password,role}=req.body;
    bcrypt.hash(password,+process.env.round,async(err,hash)=>{
        if(err){
            res.send({mess:err.message})
        }else{
            try {
                let user=new userModel({name,email,password:hash,role})
                await user.save();
                res.send({mess:"Signup Successfull"})
            } catch (error) {
                res.send({mess:err.message})
                console.log({mess:err.message});
            }
        }
    })
})


userRouter.post("/login",async(req,res)=>{
    let {email,password}=req.body;
    let user=await userModel.findOne({email});
    if(user){
        bcrypt.compare(password,user.password,async(err,result)=>{
            if(result){
                let token=jwt.sign({role:user.role},"normal",{expiresIn:60});
                let ref_token=jwt.sign({role:user.role},"refresh",{expiresIn:300});
                res.cookie("token",token)
                res.cookie("ref_token",ref_token)
                res.send({mess:user.name+" Login Successful"})
            }else{
                res.send({mess:"Invalid Credentials"});
            }
        })
    }else{
        res.send({mess:"Invalid Credentials"});
    }
})

userRouter.get("/getnewtoken",(req,res)=>{
    const token=req.cookies.ref_token;
    if(token){
        jwt.verify(token,"refresh",(err,decoded)=>{
            if(err){
                res.send({mess:"Login Again refToken is expired"});
            }else{
                 let ntoken=jwt.sign({role:decoded.role},"normal",{expiresIn:60});
                 res.cookie("token",ntoken)
                 res.send({mess:"refreshed normal token generated"})
            }
        })

    }else{
        res.send({mess:"Login again refToken not found"});
    }
})

userRouter.get("/logout",(req,res)=>{
    const token=req.cookies.token;
    let file=JSON.parse(fs.readFileSync("./blacklist.json","utf-8"))
    file.push(token);
    fs.writeFileSync("./blacklist.json",JSON.stringify(file),"utf-8");
    res.send({mess:"Logout Successfull"})
})










module.exports={userRouter};