const mongoose = require('mongoose')

const RoomSchema = new mongoose.Schema({
    roomno: String,
    roomtype:String,
    status:String, 
    rate: Number,
    description:String,
    images:[String],

},{timestamps:true});

 const RoomModel = mongoose.model("room",RoomSchema);
 module.exports=RoomModel;