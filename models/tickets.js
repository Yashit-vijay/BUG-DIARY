const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    commenter: {
        type:String,
        required:true
    },
    message: {
        type:String,
        required:true
    }
})

const ticketSchema = new mongoose.Schema({
    creator:{
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
    project:{
        type: String,
        required: true, 
    },
    manager:{
        type: String,
        required: true,
        default: 'NA'
    },
    developer:{
        type: String,
        required: true,

    },
    priority:{
        type: String,
        required: true,

    },
    status:{
        type: String,
        required: true,

    },
    type:{
        type: String,
        required: true,

    },
    createdAt:{
        type: Date,
        default: Date.now,
    },
    lastupdated:{
        type: String,
        default: 'Not Updated',
    },
    comments: [commentSchema]
});


const Ticket = mongoose.model('ticket', ticketSchema);
module.exports = Ticket;