const adminmiddleware = (req,res,next)=>{
    if(!req.user){
        return res.status(401).json({message:"Unauthorized"});
    }

    if(req.user.role !== "admin"){
        return res.status(403).json({message:"Access denied"});
    }
console.log(req.user);

    next();
}

module.exports = {adminmiddleware};
