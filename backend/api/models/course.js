const mongoose = require('mongoose');

const courseSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    faculty_email:String,
    department:String,
    term:String,
    
   });

module.exports = mongoose.model('Course', courseSchema);