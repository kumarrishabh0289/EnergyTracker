const mongoose = require('mongoose');

const enrollSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    course_id: String,
    student: String,
    enroll_id: String,
    
   
      
   });

module.exports = mongoose.model('Enroll', enrollSchema);