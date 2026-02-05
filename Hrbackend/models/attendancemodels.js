const mongoose = require("mongoose");
const usermodels = require("./usermodels");

const attendanceSchema = new mongoose.Schema({
    userid:{type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true,
    },
    date:{type:Date,
        required:true,
    },
    status:{
        type:String,
        enum:["present","absent"],
        default:"present",
    },
})
attendanceSchema.index({userid:1, date:1},{unique:true});
module.exports = mongoose.model("attendance",attendanceSchema);