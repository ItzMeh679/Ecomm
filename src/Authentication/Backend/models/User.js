const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: function() {
            return !this.googleId; // Password is required only if not using Google OAuth
        }
    },
    googleId: {
        type: String,
        sparse: true // Allows multiple documents with null values
    },
    dateOfBirth: {
        type: Date,
        required: true
    },
    verified: { 
        type: Boolean, 
        default: false 
    },
    profilePicture: {
        type: String,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt field on save
UserSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const User = mongoose.model('User', UserSchema);
module.exports = User;