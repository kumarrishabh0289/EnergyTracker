const mongoose = require('mongoose');

const enrollSchema = mongoose.Schema({
    course_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    student: String
});

module.exports = mongoose.model('Enroll', enrollSchema);