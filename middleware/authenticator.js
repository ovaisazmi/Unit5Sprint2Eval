const express=require("express");
const jwt=require("jsonwebtoken");
const fs=require("fs");


const authenticator=(req,res,next)=>{
    const token=req.cookies.token;
    
    if(token){

        let file=JSON.parse(fs.readFileSync("./blacklist.json","utf-8"))
        if(file.includes(token)){
            res.send({mess:"Login first cannot access with Blacklisted token"});
            return;
        }

        jwt.verify(token,"normal",(err,decoded)=>{
            if(decoded){
                req.body.role=decoded.role;
                next();
            }else{
                res.send({mess:"Please Login First",err:err.message})
            }
        })
    }
    else{
        res.send({mess:"Please Login First",err:err.message})
    }
}


module.exports={authenticator};