const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    isLabTechnician: {
        type: Boolean,
        default: false
    },
    rememberMe: {
        type: Boolean,
        default: false
    },
    description: {
        type: String,
        default: ''
    },
    imagePath: {
        type: String,
        default: 'default.jpg'
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
