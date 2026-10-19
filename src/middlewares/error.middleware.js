const multer = require("multer")

// Handle application errors
function errorMiddleware(err, req, res, next) {
    // Handle Multer errors
    if (err instanceof multer.MulterError) {
        return res.status(400).json({
            message: err.message
        })
    }

    // Handle invalid file type errors
    if (err.message === "Only audio files are allowed.") {
        return res.status(400).json({
            message: err.message
        })
    }

    // Handle other errors
    console.error("Server error:", err)

    // Return a server error response
    return res.status(500).json({
        message: "Internal server error"
    })
}

module.exports = errorMiddleware