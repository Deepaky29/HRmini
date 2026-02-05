const express = require("express");
const User = require("../models/usermodels");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const Registeruser = async(req,res)=>{
    try{
        const{name,email,password} = req.body;

        if(!name||!email||!password){
            return res.status(400).json({message:"All fields are required"});
        }
        const existinguser = await User.findOne({email:email.toLowerCase()});
        if(existinguser){
            return res.status(400).json({message:"Email is already register please login"});
        }
        const hashpassword = await bcrypt.hash(password,10);
        const newuser = await User.create({
            name,
            email:email.toLowerCase(),
            password:hashpassword,
        });
        res.status(201).json({message:"user register successfully"});
    }
    catch(error){
        console.error(error);
        res.status(500).json({message:"server is not responding "});
    }
}

const login =async(req,res)=>{
    try{
        const {email,password} = req.body;
        if(!email||!password){
            return res.status(400).json({message:"All fields are required"});
        }
        const existinguser = await User.findOne({email:email.toLowerCase()});

        if(!existinguser){
            return res.status(401).json({message:"User not found"});
        }
        const verify = await bcrypt.compare(password,existinguser.password);
        if(!verify){
            return res.status(401).json({message:"Invalid creditional"});
        }
        const token = jwt.sign(
  { id: existinguser._id, role: existinguser.role },
  process.env.JWT_SECRET,
  { expiresIn: "1d" }
)
        return res.status(200).json({
            token,
            user:{
            id:existinguser._id,
            name:existinguser.name,
            role:existinguser.role,
            }
        });

    }
    catch(error){
        console.error(error);
        return res.status(500).json({message:"server error"});
        
    }
   
}
const Profile = async (req,res)=>{
   try{

      const user = await User.findById(req.user.id)
                             .select("-password");

      return res.status(200).json(user);

   }catch(error){
      return res.status(500).json({
         message:"Server error"
      });
   }
}

module.exports = {
    Registeruser,
    login,
    Profile,
}