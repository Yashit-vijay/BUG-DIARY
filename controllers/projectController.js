//REQURING USER MODEL
const User = require('../models/Users');
const Project = require('../models/projects');
const Ticket = require('../models/tickets');
const jwt = require('jsonwebtoken');
require("dotenv").config();

//DISPLAY ALL PROJECTS
module.exports.myProject_get = (req, res) => {
    const token = req.cookies.jwt;
    if(token){
        jwt.verify(token, process.env.JWT_SECRET, async (error, decodedToken) =>{
            try{
                User.findById(decodedToken.id)
                    .then(currentUser => {
                        if(currentUser.role == 'Admin'){
                            Project.find()
                            .then(projects => {
                                res.status(200).render('myProjects', {title: 'My Projects', projects, currentUser});
                            })
                            .catch(error => {
                                console.log(error);
                            })
                        }
                        if(currentUser.role == 'Project Manager'){
                            Project.find({manager: currentUser.username})
                                .then(projects => {
                                    res.status(200).render('myProjects', {title: 'My Projects', projects, currentUser});
                                })
                                .catch(error => {
                                    console.log(error);
                                })
                        }
                        if(currentUser.role == 'Developer'){
                            Project.find({$or:[{developer: currentUser.username}, {developer2: currentUser.username}]})
                                .then(projects => {
                                    res.status(200).render('myProjects', {title: 'My Projects', projects, currentUser});
                                })
                                .catch(error => {
                                    console.log(error);
                                })
                        }
                    })
                    .catch(error => {
                        console.log(error);
                    })
            }
            catch{
                console.log(error);
            }
        });
    }
}

//DISPLAY CREATE PROJECT
module.exports.createProject_get = (req, res) => {
    const token = req.cookies.jwt;
    if(token){
        jwt.verify(token, process.env.JWT_SECRET, async (error, decodedToken) =>{
            try{
                User.findById(decodedToken.id)
                    .then(currentUser => {
                        User.find()
                        .then(users => {
                            res.status(200).render('createProject', {title: 'Create Project', currentUser, users});
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
        });
    }
}

// CREATE NEW PROJECT
module.exports.createProject_post = (req, res) => {
    const {title, description, manager, developer, developer2} = req.body; 
    const token = req.cookies.jwt;
    if(token){
        jwt.verify(token, process.env.JWT_SECRET, async (error, decodedToken) =>{
            try{
                User.findById(decodedToken.id)
                    .then(currentUser => {
                        let project = new Project({
                            creator: currentUser.id,
                            title,
                            description,
                            manager,
                            developer,
                            developer2
                        });
                        project.save();
                        res.redirect('/myprojects')
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

// DISPLAY DETAILS OF PROJECTS
module.exports.projectdetails_get = (req, res) => {
    const projectId  = req.params.id;
    const token = req.cookies.jwt;
    if(token){
        jwt.verify(token, process.env.JWT_SECRET, async (error, decodedToken) =>{
            try{
                Project.findById(projectId)
                .then(project => {
                    User.find({$or:[{username: project.manager}, {username: project.developer}, {username: project.developer2}]})
                        .then(users => {
                            Ticket.find({project: project.title})
                                .then(tickets => {
                                    User.findById(decodedToken.id)
                                        .then(currentUser => {
                                            res.status(200).render('projectDetail', {title: project.title, project, users, tickets, currentUser});
                                        })
                                        .catch(error => {
                                            console.log(error);
                                        })
                                })
                                .catch(error => {
                                    console.log(error);
                                })
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

//DELETE PROJECT
module.exports.deleteproject_delete = (req, res) => {
    const projectId  = req.params.id;
    Project.findByIdAndDelete(projectId)
        .then(deletedBlog => {
            res.json({ redirect: '/myprojects' });
        })
        .catch(error => {
            console.log(error);
        })

}

//EDIT PROJECT
module.exports.editproject_get = (req, res) => {
    const projectId  = req.params.id;
    const token = req.cookies.jwt;
    if(token){
        jwt.verify(token, process.env.JWT_SECRET, async (error, decodedToken) =>{
            try{
                User.findById(decodedToken.id)
                    .then(currentUser => {
                        User.find()
                        .then(users => {
                            Project.findById(projectId)
                                .then(project => {
                                    res.status(200).render('editProject', {title: 'Edit Project', currentUser, users, project});
                                })
                                .catch(error => {
                                     console.log(error)
                                })
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
        });
    }
}
module.exports.editproject_post = (req, res) => {
    const projectId  = req.params.id;
    const {title, description, manager, developer, developer2} = req.body; 
    Project.findByIdAndUpdate(projectId, {
        title,
        description,
        manager,
        developer,
        developer2
    })
    .then(result => {
        res.redirect('/projectdetail/'+projectId);
    })
    .catch(error => {
        console.log(error);
    })
}


