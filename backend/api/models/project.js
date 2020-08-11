const mongoose = require('mongoose');

const projectSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    course_id: String,
    faculty_email: String,
    StartDate: Date,
    ConservationStartDate: Date,
    EndDate: Date,
    projectname:String
    
    
   });

module.exports = mongoose.model('Project', projectSchema);