const mongoose = require('mongoose')

const ReservationSchema = new mongoose.Schema({
    user_id: String,
    room_id: String,
    check_in:Date,
    check_out:Date, 
    booking_date:Date,
    status:String,
    check_in_time:Date,
    check_out_time:Date,
    total_amount: Number,
    
},{timestamps:true});

 const ReservationModel = mongoose.model("reservation",ReservationSchema);
 module.exports=ReservationModel;