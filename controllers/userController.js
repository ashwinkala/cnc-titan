const User = require('../models/user');
const bcrypt = require('bcryptjs');

// Register REST API
exports.get_register = function(req, res, next){
    res.render('register');
}
exports.post_register = function(req, res, next){
    // Create a new account with the following fields
    var name = req.body.name;
    var company_name = req.body.company_name;
    var email = req.body.email;
    var password = req.body.password;
    var confirm_password = req.body.confirm_password;
    var role = req.body.role;
    // Will have to figure out how this will be created and then added to our function
    // var bc_address = req.body.bc_address;

    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('company_name', 'Company Name is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email formatting is not correct').isEmail();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('confirm_password', 'Passwords do not match').equals(req.body.password);
    req.checkBody('role', 'Role is required').notEmpty();
    var errors = req.validationErrors();
    if(errors){ 
        res.render('register', { errors: errors }) 
    } else {
        exports.create_user(name, company_name, email, password, role, function(err, new_user){
            if(err) {
                console.log(err); 
                res.render('register', { errors: errors, message: 'New user not created - user already exists in the database' })
            } else {
                console.log(new_user)
                req.flash('success_msg', 'You are registered and can now login');
                res.redirect('/users/login');
            }
        });
    };
}
exports.create_hash = function(password, number, callback){
    bcrypt.genSalt(number, function(err, salt){
        bcrypt.hash(password, salt, function(err, hash){
            if(err) callback(err, null);
            callback(null, hash);
        });
    });
}
exports.create_user = function(name, company_name, email, password, role, callback){
    exports.create_hash(password, 10, function(err, hash){
        if(err) callback(err, null);
        user_created = new User({
            name: name,
            company_name: company_name,
            email: email,
            password: hash,
            role: role
        });
        user_created.save(callback);
    });
}
// Login REST API
exports.get_login = function(req, res, next){
    res.render('login');
}

exports.post_login = function(req, res, next){
    var email = req.body.email;
    var password = req.body.password;
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email formatting is not correct').isEmail();
    req.checkBody('password', 'Password is required').notEmpty();    
    var errors = req.validationErrors();
    if(errors){ 
        res.render('login', { errors: errors }) 
    } else {
        exports.find_user_by_email(email, function(err, user){
            if(err){
                req.flash('error_msg', 'Error logging in');
                res.redirect('/users/login');
            } else if(!user){
                req.flash('error_msg', 'User does not exist');
                res.redirect('/users/login');
            } else {
                exports.compare_password(password, user.password, function(err, isMatch){
                    if(err) throw err;
                    if(isMatch){
                        req.flash('success_msg', 'You are logged in!');
                        res.redirect('/');
                    } else {
                        req.flash('error_msg', 'Invalid password');
                        res.redirect('/users/login');
                    }
                });
            }
        });
    }
}
exports.find_user_by_email = function(email, callback){
    var query = { email: email };
    User.findOne(query, callback);
}
exports.compare_password = function(password, hash, callback){
    bcrypt.compare(password, hash, function(err, isMatch){
        if(err) callback(err, null);
        callback(null, isMatch);
    });
}

exports.get_logout = function(req, res){
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
}

//  PASSPORT LOGIN
exports.passport_serialize_user = function(user, done){
    done(null, user.id);
}
exports.passport_deserialize_user = function(id, done){
    exports.find_user_by_id(id, function(err, user){
        done(err, user);
    });
}
exports.find_user_by_id = function(id, callback){
    User.findById(id, callback);
}
exports.passport_post_login = function(req, res, next){
    res.redirect('/');
}
exports.passport_strategy = function(email, password, done){
    exports.find_user_by_email(email, function(err, user){
        if(err) throw err;
        if(!user){
            return done(null, false, {message: 'Unknown user'});
        }
        exports.compare_password(password, user.password, function(err, isMatch){
            if(err) throw err;
            if(isMatch){
                return done(null, user);
            } else {
                return done(null, false, {message: 'Invalid password'});
            }
        })
    })
}
//  PASSPORT LOGIN