const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const projectSchema = new Schema({
    name: { type: String, required: true },
    baseStart: {type: Date, required: true }, 
    conserveStart: {type: Date, required: true }, 
    conserveEnd: {type: Date, required: true }, 
    data: [{
        name: { type: String, required: true },
        electricity: [{ type: Number }],
        gas: [{ type: Number }]
    }]
});

module.exports = mongoose.model('Project', projectSchema);