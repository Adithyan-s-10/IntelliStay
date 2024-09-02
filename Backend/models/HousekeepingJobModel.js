const mongoose = require('mongoose')

const HousekeepingJobSchema = new mongoose.Schema({
    staff_id: String,
    room_id: String,
    task_description: String,
    task_date:Date,
    status:String,
    
},{timestamps:true});

 const HousekeepingJobModel = mongoose.model("housekeepingjob",HousekeepingJobSchema);
 module.exports=HousekeepingJobModel;