const mongoose = require("mongoose");

const leaveSchema = new mongoose.Schema({
    userid:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true,
    
    },
    leavetype:{type:String,
        required:true,},
    startdate:{type:Date,
        required:true,},
    enddate:{type:Date,
        required:true,},
    totaldays:{type:Number,
        required:true,},
    status:{
        type:String,
        enum:["pending","approved","rejected"],
        default:"pending",
        required:true,
    },
    reason:{type:String,
        required:true,},
    applieddate:{
        type:Date,
        default:Date.now,
        required:true,
    }
});

module.exports = mongoose.model("leave",leaveSchema);