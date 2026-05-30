const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        trim: true,
        minlength : [3, 'Username must be at least 3 characters long']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Please fill a valid email address']
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    socialLinks: {
        github: {
            type: String,
            trim: true
        },
        linkedin: {
            type : String,
            trim: true
        }
    },
    refreshToken: {
        type : String,
        default: ''
    }
},
{
    timestamps: true
});

const User = mongoose.model('User', userSchema);

module.exports = User;