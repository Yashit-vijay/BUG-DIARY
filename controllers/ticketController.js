//REQURING USER MODEL
const User = require('../models/Users');
const Project = require('../models/projects');
const Ticket = require('../models/tickets');
const jwt = require('jsonwebtoken');
require("dotenv").config();


module.exports.createTicket_get = (req, res) => {
    const projectId  = req.params.id;
    Project.findById(projectId)
        .then(project => {
            res.status(200).render('createTicket', {title: 'Create Ticket', project});
        })
        .catch(error => {
            console.log(error);
        })
};

module.exports.createTicket_post = (req, res) => {
    const projectId  = req.params.id;
    const {title, description, developer, status, type, priority} = req.body;
    const token = req.cookies.jwt;
    if(token){
        jwt.verify(token, process.env.JWT_SECRET, async (error, decodedToken) =>{
            try{
                Project.findById(projectId)
                    .then(project => {
                        User.findById(decodedToken.id)
                        .then(currentUser => {
                            let ticket = new Ticket({
                                creator: currentUser.id,
                                title,
                                description,
                                project:project.title,
                                developer,
                                manager:project.manager,
                                status,
                                type,
                                priority
                            });
                            ticket.save();
                            res.redirect('/myprojects');
                        })
                        .catch(error => {
                            console.log(error);
                        })
                    })
                    .catch(error => {
                        console.log(error);
                    })
                
            }
            catch{
                console.log(error);
            }
        })
    } 

}

module.exports.mytickets_get = (req, res) => {
    const token = req.cookies.jwt;
    if(token){
        jwt.verify(token, process.env.JWT_SECRET, async (error, decodedToken) =>{
            try{
                User.findById(decodedToken.id)
                    .then(currentUser => {
                        if(currentUser.role == 'Admin'){
                            Ticket.find()
                                .then(tickets => {
                                    res.status(200).render('myTickets', {title: 'My Tickets', tickets});
                                })
                                .catch(error => {
                                    console.log(error);
                                });
                        }
                        if(currentUser.role == 'Project Manager'){
                            Ticket.find({manager: currentUser.username})
                                .then(tickets => {
                                    res.status(200).render('myTickets', {title: 'My Tickets', tickets});
                                })
                                .catch(error => {
                                    console.log(error);
                                });
                        }
                        if(currentUser.role == 'Developer'){
                            Ticket.find({$or:[{developer:currentUser.username}, {developer2:currentUser.username}]})
                                .then(tickets => {
                                    res.status(200).render('myTickets', {title: 'My Tickets', tickets});
                                })
                                .catch(error => {
                                    console.log(error);
                                });
                        }
                    })
                    .catch(error => {
                        console.log(error);
                    });
            }
            catch{
                console.log(error);
            }
        });
    }
}

module.exports.ticketdetails_get = (req, res) => {
    const ticketId  = req.params.id;
    Ticket.findById(ticketId)
        .then(ticket => {
            res.status(200).render('ticketDetail', {title: ticket.title, ticket});
        })
        .catch(error => {
            console.log(error);
        })
}

module.exports.deleteticket_delete = (req, res) => {
    const ticketId  = req.params.id;
    Ticket.findByIdAndDelete(ticketId)
        .then(deletedBlog => {
            res.json({ redirect: '/mytickets' });
        })
        .catch(error => {
            console.log(error);
        })

}

module.exports.editTicket_get = (req, res) => {
    const ticketId  = req.params.id;
    Ticket.findById(ticketId)
        .then(ticket => {
            Project.findOne({title: ticket.project})
                .then(project => {
                    res.status(200).render('editTicket', {title: 'Edit Ticket', ticket, project});
                })
                .catch(error => {
                    console.log(error);
                })
        })
        .catch(error => {
            console.log(error);
        })
}

module.exports.editTicket_post = (req, res) => {
    const ticketId  = req.params.id;
    const {title, description, developer, status, type, priority} = req.body;
    Ticket.findByIdAndUpdate(ticketId, {
        title,
        description,
        developer,
        status,
        type,
        priority
    })
    .then(result => {
        res.redirect('/ticketdetail/'+ticketId);
    })
    .catch(error => {
        console.log(error);
    })
}

module.exports.createComment_post = (req, res) => {
    const {message} = req.body;
    const ticketId  = req.params.id;
    const token = req.cookies.jwt;
    if(token){
        jwt.verify(token, process.env.JWT_SECRET, async (error, decodedToken) =>{
            try{
                User.findById(decodedToken.id)
                    .then(currentUser => {
                        Ticket.findByIdAndUpdate(ticketId,{ $push : { comments: {
                            commenter: currentUser.username, 
                            message
                        }}})
                        .then(result => {
                            res.redirect('/ticketdetail/'+ticketId)
                        })
                        .catch(error => {
                            console.log(error);
                        })
                    })
                    .catch(error => {
                        console.log(error);
                    })
            }
            catch{
                console.log(error);
            }
        })
    }
}