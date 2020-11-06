const express = require('express');
const morgan = require('morgan');
const {connect} = require('mongoose');
const cookieParser = require('cookie-parser');
const { urlencoded } = require('express');
const ejsLayouts = require('express-ejs-layouts');
const { checkUser } = require('./middlewares/authMiddleware');
const app = express();
require("dotenv").config();

//REGISTER VIEW ENGINE
app.set('view engine', 'ejs');

//REGISTER LAYOUT
app.use(ejsLayouts);
app.set("layout", "./Layouts/mainLayout");

//BODY PARSER MIDDLEWARE
app.use(express.json());

//PUBLIC MIDDLEWARE
app.use(express.static('public'));
app.use('/css', express.static(__dirname + 'public/css'));
app.use('/js', express.static(__dirname + 'public/js'));
app.use('/img', express.static(__dirname + 'public/images'));

//MORGAN MIDDLEWARE FOR DETAILS OF REQ
app.use(morgan("dev"));

// COOKIE PARSER MIDDLEWARE
app.use(cookieParser());

//SETTING LINK TO DATABASE
const dbURI = process.env.DB_CONNECT;

//CONNECTING TO DATABASE
connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true})
.then((result) => app.listen(process.env.PORT || PORT)) //LISTINING PORT
.catch((err) => console.log(err)); 


app.use(urlencoded({ extended: true }));

//ROUTES
app.get('*', checkUser);
app.use(require("./routes/authRoutes"));
app.use(require("./routes/staticRoutes"));

// 404 ERROR PAGE
app.use((req,res)=>{
    res.status(404);
    res.render( '404',{title: 'Page Not Found'});
})


