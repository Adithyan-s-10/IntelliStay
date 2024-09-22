const mongoose = require('mongoose')

const LeaveApplicationSchema = new mongoose.Schema({
    staff_id: { type: String, required: true },
    leaveType: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    reason: { type: String, required: true },
    appliedon: { type: Date, required: true },
    approvedon: { type: Date},
    status: { type: String, default: 'Pending' },
}, { timestamps: true });

 const LeaveApplicationModel = mongoose.model("LeaveApplication",LeaveApplicationSchema);
 module.exports=LeaveApplicationModel;