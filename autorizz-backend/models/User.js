const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    phoneNumber: { type: String }, // Optional field for phone number
    address: { type: String },     // Optional field for address
    dateOfBirth: { type: Date },   // Optional field for date of birth
    gender: { type: String, enum: ['Male', 'Female', 'Other'] },
    role: {
        type: String,
        default: 'User', // Default role can be 'User' or 'Agent', depending on the context
        enum: ['User', 'Admin', 'Agent'], // Restrict role values
    },
});

module.exports = mongoose.model('User', UserSchema);
