const mongoose = require('mongoose')

const StaffSchema = new mongoose.Schema({
    displayName:String,
    image:String, 
    email: String,
    password:String,
    phone_no:String,
    role:String,
    address:String,
    dob:String,
    salary:Number,
    feedback:String,
    availability:Boolean,
    
},{timestamps:true});

 const StaffModel = mongoose.model("staffs",StaffSchema);
 module.exports=StaffModel;