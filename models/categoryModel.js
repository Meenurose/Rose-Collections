const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  
  categoryname: {
    type: String,
    required: true, 
    unique: true,
    collation: { locale: 'en', strength: 2 }, 
    lowercase: true      
  },
  description: {
    type: String
  },
  listed:{
   type:Boolean,
   default:true
 },
 image: {
  type: String,
  default: false
 }

});

module.exports = mongoose.model('categories', categorySchema,'categories')