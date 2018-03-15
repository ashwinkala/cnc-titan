// Packages that we are using 

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongo = require('mongodb');
const mongoose = require('mongoose');

// Connect to the database
mongoose.connect('mongodb://localhost/titan-dev');
var db = mongoose.connection;

// Routes
var pages = require('./routes/pages');
var users = require('./routes/users');

// Initialize the application
var app = express();

// View Engine  
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout:'layout'}));
app.set('view engine', 'handlebars');

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Setting the static folder
app.use(express.static(path.join(__dirname, 'public')));

// Express session
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

// Passrpot init
app.use(passport.initialize());
app.use(passport.session());

// Express Validator

app.use(expressValidator({
    errorFormatter: function(param, msg, value){
            var namespace = param.split('.')
            , root = namespace.shift()
            , formParam = root;
        while(namespace.length){
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param   :  formParam,
            msg     :  msg,
            value   :  value
        };
    }
}));

// Connect Flash
app.use(flash());

// Global Variables
app.use(function (req, res, next){
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});

app.use('/', pages);
app.use('/users', users);

// Set Port
app.set('port', (process.env.PORT || 3000));

app.listen(app.get('port'), function(){
    console.log('Server started on port: ' + app.get('port'));
});