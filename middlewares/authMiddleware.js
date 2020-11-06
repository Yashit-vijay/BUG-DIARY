const jwt = require('jsonwebtoken');
const User = require('../models/Users');
require("dotenv").config();

const requireAuth = (req, res, next) => {
    const token = req.cookies.jwt;
    // jb
    if(token){
        jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
            if(err){
                console.log(err.message);
                res.redirect('/');
            }else{
                console.log(decodedToken);
                next();
            }
        })
    }
    else{
        res.redirect('/');
    }
}

// CHECK CURRENT USER
const checkUser = (req, res, next) => {
    const token = req.cookies.jwt;

    if(token){
        jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
            try{
                console.log(decodedToken);
                User.findById(decodedToken.id)
                .then(user => {
                    res.locals.user = user;
                    next();
                })
                .catch(error => {
                    console.log(error);
                })
            }
            catch(err){
                console.log(err.message);
                res.locals.user = null;
                next();
            }
        })
    }
    else {
        res.locals.user = null;
        next();
    }
    
}


module.exports = { requireAuth , checkUser};