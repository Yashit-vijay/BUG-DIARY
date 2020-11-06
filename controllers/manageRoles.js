//REQURING USER MODEL   
const User = require('../models/Users');
//DISPLAY ALL USERS
module.exports.manageRoles_get = (req, res) => {
    User.find()
        .then(result => {
            res.status(200);
            res.render('manageRoles', { title: 'Manage Roles', users: result });
        }).catch(err => {
            console.log(err);
        });
};

module.exports.manageRoles_post = (req, res) => {
    const { users, role } = req.body;
        users.forEach(user => {
            User.findOneAndUpdate({username: user}, {role: role}, {new: true}, function( err, result){
                if(err){
                    console.log(err);
                }
            });
        })
}
