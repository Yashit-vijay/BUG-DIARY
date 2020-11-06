const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const bcrypt = require('bcrypt');
const {isEmail} = require('validator');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter your name"],
    },
    username: {
        type: String,
        required: [true, "Please enter username"],
        unique: true
    },
    email: {
        type: String,
        required: [true, "Please enter an email"],
        unique: true,
        lowercase: true,
        validate: [isEmail, "Please enter a valid email"],
    },
    mobileno: {
        type: String,
        required: true,
        unique: true,
        minlength: [10, "Please enter a valid moblie number"],
        maxlength: [10, "Please enter a valid moblie number"],
    },
    password: {
        type: String,
        required: [true, 'Please enter an password'],
        minlength: [8, 'Minimum password length is 8 characters']
    },
    role: {
        type: String,
        default: 'NA',
        enum: ['NA','Admin','Project Manager','Developer']
    },
});

// PLUGIN TO VALIDATE UNIQUE VALUES
userSchema.plugin(uniqueValidator);

// HASHING PASSWORD
userSchema.pre('save', async function(next){
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

// STATIC METHOD TO LOGIN USER
userSchema.statics.login = async function(username, password){
    console.log(username,password);
    const user = await this.findOne({ username });
    if(user){
        const auth = bcrypt.compare(password, user.password);
        console.log(auth);
        if(auth){
            return user;
        }
        throw Error ('Incorrect Password');
    }
    throw Error ('Incorrect Username');
}

const User = mongoose.model('user', userSchema);
module.exports = User;