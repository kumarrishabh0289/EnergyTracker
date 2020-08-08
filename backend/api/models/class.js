const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const classSchema = new Schema({
    name: { type: String, required: true },
    projects: [{ type: Schema.Types.ObjectId, ref: 'Project' }],
    students: [{
        type: String
    }]
});

module.exports = mongoose.model('Class', classSchema);