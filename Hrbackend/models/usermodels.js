const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
    name:{type:String},
    email:{type:String,
        required:true,
        unique:true,
    },
    password:{type:String,
        required:true,
    },
    role:{
        type:String,
        based :["employee","admin"],
        default:"employee",        
    
    },
    dateofjoining:{
        type:Date,
        default:Date.now,
    },
    leaving:{
        type:Number,
        default:20,
    },

}
)
module.exports = mongoose.model("user",userSchema);