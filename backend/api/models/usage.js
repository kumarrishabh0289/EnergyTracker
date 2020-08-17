const mongoose = require('mongoose');

const usageSchema = mongoose.Schema({
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    date: Date,
    gas: { type: String, default: "" },
    electricity: { type: String, default: "" },
    user_id: String
});

module.exports = mongoose.model('Usage', usageSchema);