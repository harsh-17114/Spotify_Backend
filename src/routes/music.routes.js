const express = require("express")
const musicController = require("../controllers/music.controller.js")
const authMiddleware = require("../middlewares/auth.middleware.js")
const upload = require("../middlewares/file.middleware.js")

const router = express.Router()

// Upload music
// Requires the user to be artist
// POST /api/music/upload
router.post("/upload", authMiddleware.authMiddleware, upload.single("music"), musicController.createMusicController)

// Create album
// Requires the user to be artist
// POST /api/music/album
router.post("/album", authMiddleware.authMiddleware, musicController.createAlbumController)

// Get all music
// GET /api/music/
router.get("/", musicController.getAllMusicsController)

// Get all albums
// GET /api/music/albums
router.get("/albums", musicController.getAllAlbumsController)

// Get album by ID
// GET /api/music/albums/ID
router.get("/albums/:albumId", musicController.getAlbumByIdController)

module.exports = router