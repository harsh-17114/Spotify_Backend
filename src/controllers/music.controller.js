const mongoose = require("mongoose")
const musicModel = require("../models/music.model.js")
const albumModel = require("../models/album.model.js")
const services = require("../services/storage.service.js")

// Create music
async function createMusicController(req, res) {
    const { title } = req.body
    const file = req.file
    let result
    try {
        // Validate required fields
        if (!title || !file) {
            return res.status(400).json({
                message: "Title and music file are required"
            })
        }

        // Upload music file
        result = await services.uploadFile(file.buffer.toString('base64'))

        // Check if the upload was successful
        if (!result || !result.url) {
            return res.status(500).json({
                message: "Music upload failed"
            })
        }

        // Save music details
        const music = await musicModel.create({
            uri: result.url,
            title,
            artist: req.user._id,
        })

        // Send music response
        res.status(201).json({
            message: "Music created successfully",
            music: {
                id: music._id,
                uri: music.uri,
                title: music.title,
                artist: music.artist,
            }
        })
    }
    catch (err) {
        console.error("Create music error:", err)

        // Delete uploaded file if database creation fails
        if (result?.fileId) {
            await services.deleteFile(result.fileId)
        }

        // Return a server error response
        return res.status(500).json({
            message: "Internal server error"
        })
    }
}

// Create album
async function createAlbumController(req, res) {
    const { title, musics } = req.body
    try {
        // Validate required fields
        if (!title || !Array.isArray(musics) || musics.length === 0) {
            return res.status(400).json({
                message: "Title and musics are required"
            })
        }

        // Check for duplicate music IDs
        const uniqueMusics = [...new Set(musics)]

        if (uniqueMusics.length !== musics.length) {
            return res.status(400).json({
                message: "Album cannot contain duplicate music"
            })
        }

        // Validate if all music IDs are valid MongoDB ObjectIds
        const areMusicIdsValid = musics.every((id) =>
            mongoose.Types.ObjectId.isValid(id)
        )

        // Check if all provided music IDs are valid
        if (!areMusicIdsValid) {
            return res.status(400).json({
                message: "One or more music IDs are invalid"
            })
        }

        // Validate if all music IDs are valid MongoDB ObjectIds
        const musicExists = await musicModel.countDocuments({
            _id: { $in: musics },
            artist: req.user._id
        })

        // Check if all provided music IDs exist
        if (musicExists !== uniqueMusics.length) {
            return res.status(404).json({
                message: "One or more music files not found or do not belong to you"
            })
        }

        // Save album details
        const album = await albumModel.create({
            title,
            artist: req.user._id,
            musics: musics,
        })

        // Send album response
        res.status(201).json({
            message: "Album created successfully",
            album: {
                id: album._id,
                title: album.title,
                artist: album.artist,
                musics: album.musics,
            }
        })
    }
    catch (err) {
        console.error("Create album error:", err)

        // Return a server error response
        return res.status(500).json({
            message: "Internal server error"
        })
    }
}

// Get all music
async function getAllMusicsController(req, res) {
    try {
        // Fetch music with artist details
        const musics = await musicModel.find().populate("artist", "username email")

        // Send music list
        res.status(200).json({
            message: "Musics fetched successfully",
            musics: musics,
        })
    }
    catch (err) {
        console.error("Get all musics error:", err)

        // Return a server error response
        return res.status(500).json({
            message: "Internal server error"
        })
    }
}

// Get all albums
async function getAllAlbumsController(req, res) {
    try {
        // Fetch albums with artist details
        const albums = await albumModel.find().select("title artist").populate("artist", "username email")

        // Send album list
        res.status(200).json({
            message: "Albums fetched successfully",
            albums: albums,
        })
    }
    catch (err) {
        console.error("Get all albums error:", err)

        // Return a server error response
        return res.status(500).json({
            message: "Internal server error"
        })
    }
}

// Get album by ID
async function getAlbumByIdController(req, res) {
    const albumId = req.params.albumId
    try {
        // Validate album ID
        if (!albumId) {
            return res.status(400).json({
                message: "Album ID is required"
            })
        }

        // Validate if the album ID is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(albumId)) {
            return res.status(400).json({
                message: "Invalid album ID"
            })
        }

        // Find album and populate details
        const album = await albumModel.findById(albumId).populate("artist", "username email").populate("musics")

        // If album is not found
        if (!album) {
            return res.status(404).json({
                message: "Album not found"
            })
        }

        // Send album response
        return res.status(200).json({
            message: "Album fetched successfully",
            album: album,
        })
    }
    catch (err) {
        console.error("Get album by ID error:", err)

        // Return a server error response
        return res.status(500).json({
            message: "Internal server error"
        })
    }
}

module.exports = { createMusicController, createAlbumController, getAllMusicsController, getAllAlbumsController, getAlbumByIdController }