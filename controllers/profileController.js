//REQURING USER MODEL
const User = require('../models/Users');
const Project = require('../models/projects');
const Ticket = require('../models/tickets');
const jwt = require('jsonwebtoken');
const {isEmail} = require('validator');
require("dotenv").config();


module.exports.profile_get = (req, res) => {
    const token = req.cookies.jwt;
    if(token){
        jwt.verify(token, process.env.JWT_SECRET, async (error, decodedToken) =>{
            try{
                User.findById(decodedToken.id)
                    .then(currentUser => {
                        res.status(200).render('userProfile', {title: currentUser.name + 'Profile', currentUser})
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


module.exports.editProfile_post = (req, res) => {
    const {name, username, mobileno, email} = req.body;
    const token = req.cookies.jwt;
    if(token){
        jwt.verify(token, process.env.JWT_SECRET, async (error, decodedToken) =>{
            try{
                User.findByIdAndUpdate(decodedToken.id, {
                    name,
                    username,
                    mobileno,
                    email
                })
                .then(result => {
                    console.log(result);
                    res.redirect('/userprofile')
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

module.exports.changePassword_post = (req, res) => {
    // const {currentpassword, new}
}