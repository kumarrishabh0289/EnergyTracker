const mongoose = require('mongoose');

const usageSchema = mongoose.Schema({
    project_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    course_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    date: Date,
    gas: { type: Number, default: 0 },
    electricity: { type: Number, default: 0 },
    user_id: String
});

module.exports = mongoose.model('Usage', usageSchema);