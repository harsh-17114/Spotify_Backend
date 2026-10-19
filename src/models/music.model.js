const mongoose = require("mongoose")

// Define music schema
const musicSchema = new mongoose.Schema({
    uri: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    artist: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    }
})

// Create music model
const musicModel = mongoose.model("music", musicSchema)

module.exports = musicModel