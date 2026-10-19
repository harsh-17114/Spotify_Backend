const mongoose = require("mongoose")

// Define user schema
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
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
    role: {
        type: String,
        enum: ['user', 'artist'],
        default: 'user'
    }
})

// Create user model
const userModel = mongoose.model("user", userSchema)

module.exports = userModel