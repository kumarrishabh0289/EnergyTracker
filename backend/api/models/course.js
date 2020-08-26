const mongoose = require('mongoose');
const shortid = require('shortid');

const courseSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    faculty_email: String,
    department: String,
    term: String,
    addCode: {
        'type': String,
        'default': shortid.generate
    }
});

module.exports = mongoose.model('Course', courseSchema);