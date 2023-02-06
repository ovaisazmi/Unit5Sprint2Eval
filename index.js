const express=require("express");
require("dotenv").config();
const {connection}=require("./config/db")
const {userRouter}=require("./routes/userRouter");
const cookieParser = require('cookie-parser')
const {authenticator}=require("./middleware/authenticator")
const {authorization}=require("./middleware/authorization")
const app=express();
app.use(express.json());
app.use(cookieParser())

app.get("/",(req,res)=>{
    res.send("Server is Working Fine");
})

app.get("/goldrate",authenticator,(req,res)=>{
    res.send("Gold Rate Route");
})
app.get("/userstats",authenticator,authorization("manager"),(req,res)=>{
    res.send("USERSTATS ROUTE");
})

app.use("/user",userRouter);



app.listen(process.env.port,async()=>{
    try {
        await connection
        console.log("Connected to DB");
    } catch (error) {
        console.log(" ERROR while connecting to DB");
    }
    console.log("Server is running at "+process.env.port);
})