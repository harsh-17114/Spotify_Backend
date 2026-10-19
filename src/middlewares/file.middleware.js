const multer = require("multer")

const upload = multer({
    // Store uploaded files temporarily in memory as a Buffer
    storage: multer.memoryStorage(),

    // Limit the maximum file size to 20 MB
    limits: {
        fileSize: 20 * 1024 * 1024
    },

    // Validate the type of file being uploaded
    fileFilter: (req, file, cb) => {
        if (file.mimetype === "audio/mpeg") {
            cb(null, true)
        }
        else {
            cb(new Error("Only audio files are allowed."), false)
        }
    }
})

module.exports = upload