const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    projectName: String,
    projectDescription: String,
    status: String,
    deadline: Date,
    
    
});

module.exports = mongoose.model('Project', projectSchema);
