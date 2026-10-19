const userModel = require("../models/user.model.js")
const jwt = require("jsonwebtoken")

// Authenticate artist
async function authMiddleware(req, res, next) {
    const token = req.cookies?.token

    // Reject the request if the token is missing
    if (!token) {
        return res.status(401).json({
            message: "Unauthorized"
        })
    }

    try {
        // Verify JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await userModel.findById(decoded.id)
        
        // If no user is found, return an authentication error
        if (!user) {
            return res.status(401).json({
                message: "Unauthorized"
            })
        }
        
        // Allow only artists
        if (user.role !== "artist") {
            return res.status(403).json({
                message: "You don't have access"
            })
        }

        req.user = user
        next()
    }
    catch (err) {
        console.error("Authentication error:", err)

        // Return an unauthorized error response
        return res.status(401).json({
            message: "Unauthorized"
        })
    }
}

module.exports = { authMiddleware }