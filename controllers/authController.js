const User = require('../models/Users');
const jwt = require('jsonwebtoken');
require("dotenv").config();

// HANDLE ERRORS
const handleErrors = (err) =>{
    console.log(err.message); 
    let errors = {name:'', username:'', mobile:'', email:'', password:''};

    // LOGIN ERRORS
    if(err.message == 'Incorrect Username'){
        errors.username = 'Incorrect Username';
        return errors;
    }
    if (err.message == 'Incorrect Password') {
        errors.password = 'Incorrect Password';
        return errors;
    }

    if (err.message.includes("user validation failed")) {
        Object.values(err.errors).forEach(({ properties }) => {
            // DUPLICATE ERROR
            if (properties.type == "unique") {
                errors[properties.path] = properties.path + " already exists";
            }
            // VALIDATION ERRORS
            else {
                errors[properties.path] = properties.message;
            }
        });
        return errors;
    }

}

// 3 DAYS IN SECONDS FOR EXPIRE TIME OF JWT
const maxAge = 3 * 24 * 60 * 60;
// CREATING TOKENS
const createToken = (id)  => {
    return jwt.sign( { id }, process.env.JWT_SECRET, {
        expiresIn: maxAge,
    })
}


module.exports.signup_get = (req,res) =>{
    res.render("signup", { title: "Signup" });
}

module.exports.login_get = (req, res) => {
    res.render("login", { title: "Login" });
};

module.exports.signup_post = async (req, res) => {
    const {name, username, email, mobileno, password, role} = req.body;

    try{
        const user = await User.create({name,username,email,mobileno,password,role});
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000});
        res.status(201).json( {user: user._id} );
    }
    catch(error){
       const errors =  handleErrors(error);
       res.status(400).json( {errors} );
    }
};

module.exports.login_post = async (req, res) => {
    const { username, password} = req.body;    
    try{
        const user = await User.login(username, password);
        const token = createToken(user._id)
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 })
        res.status(200).json({user: user._id})
    }
    catch(error){
        const errors = handleErrors(error);
        res.status(400).json({ errors });
    }
};


// LOGOUT
module.exports.logout_get = (req, res) => {
    res.cookie('jwt', '', {maxAge: 1});
    res.redirect('/');
}