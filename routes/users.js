const express = require('express');
const router = express.Router();

// DO WE NEED THIS //
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
// DO WE NEED THIS //

const userController = require('../controllers/userController.js');

// GET register
router.get('/register', userController.get_register);
// POST register
router.post('/register', userController.post_register);
// GET login
router.get('/login', userController.get_login);
// POST login
passport.use(new LocalStrategy(
    {
        usernameField: 'email',
        passwordField: 'password'
    },
    userController.passport_strategy
));
passport.serializeUser(userController.passport_serialize_user);
passport.deserializeUser(userController.passport_deserialize_user);
router.post('/login', 
    passport.authenticate('local', {successRedirect:'/', failureRedirect:'/users/login',failureFlash: true}),
    userController.passport_post_login
);
// router.get('/logout', userController.post_login);    
router.get('/logout', userController.get_logout);

module.exports = router;