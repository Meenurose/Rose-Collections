const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    phonenumber:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
   
    address: [
        {
            name:{
                type:String,
                required:true
            },
            email:{
                type:String,
                required:true
            },
            phonenumber:{
                type:String,
                required:true
            },
            address: {
                type: String,
                required: true,
            },
            city: {
                type: String,
                required: true,
            },
            state: {
                type: String,
                required: true,
            },
            pincode: {
                type: Number,
                required: true,
            }
           
        }
    ],
       
});

module.exports = mongoose.model('users',userSchema, 'users');