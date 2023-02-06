const authorization=(Roles)=>{
    return(req,res,next)=>{
        let role=req.body.role;
        if(Roles==role){
            next();
        }else{
            res.send({mess:"Not Authorized"})
        }
    }
}
module.exports={authorization};