const mongoose = require('mongoose');

var UserSchema = mongoose.Schema({
    name: {
        type: String,
        index: true
    },
    company_name: {
        type: String,
    },
    password:{
        type: String,
        trim: true
    },
    email:{ 
        type: String,
        lowercase: true
    },
    role:{
        type: String,
        lowercase: true
    },
    blockchain_addr:{
        type: String,
        // unique: true
    }
});

var User = module.exports = mongoose.model('User', UserSchema);