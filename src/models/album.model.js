const mongoose = require("mongoose")

// Define album schema
const albumSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    musics: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "music",
    }],
    artist: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    }
})

// Create album model
const albumModel = mongoose.model("album", albumSchema)

module.exports = albumModel