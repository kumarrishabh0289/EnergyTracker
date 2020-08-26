const mongoose = require('mongoose');

const courseSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    faculty_email: String,
    department: String,
    term: String,
    addCode: {
        'type': String,
        'default': Math.floor(100000 + Math.random() * 900000)
    }
});

module.exports = mongoose.model('Course', courseSchema);