const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
    creator: {
        type: String,
    },
    title: {
        type: String,
        required: true,
    },
    description:{
        type: String,
        required: true,
    },
    manager:{
        type: String,
        required: true,
    },
    developer:{
        type: String,
        required: true,
    },
    developer2:{
        type: String,
        required: true,
    },
});

const Project = mongoose.model('project', projectSchema);
module.exports = Project;
