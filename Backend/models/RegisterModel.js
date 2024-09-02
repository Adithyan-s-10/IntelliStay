const mongoose = require('mongoose')

const RegisterSchema = new mongoose.Schema({
    firstname: String, 
    email: String,
    password: String 
})

 const RegisterModel = mongoose.model("registrations",RegisterSchema)
 module.exports=RegisterModel