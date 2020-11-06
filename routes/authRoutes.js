const express = require("express");
//USING EXPRESS MODEL ROUTER
const router = express.Router();
//REQURING CONTROLLERS FOR AUTH ROUTES
const { signup_get, login_get, signup_post, login_post, logout_get } = require('../controllers/authController');

router.get("/", (req, res) => {
    res.redirect("login");
});
router.get("/signup",  signup_get);
router.get("/login",   login_get);
router.post("/signup", signup_post);
router.post("/login",  login_post);
router.get("/logout",  logout_get);


module.exports = router;
