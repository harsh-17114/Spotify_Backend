const express = require("express")
const cookieParser = require("cookie-parser")
const authRoutes = require("./routes/auth.routes.js")
const musicRoutes = require("./routes/music.routes.js")
const errorMiddleware = require("./middlewares/error.middleware.js")

// Create our Express app
const app = express()

app.use(express.json())
app.use(cookieParser())

// API routes
app.get("/", (req, res) => {
    res.send("Spotify service is up and running")
})
app.use("/api/auth", authRoutes)
app.use("/api/music", musicRoutes)
app.use(errorMiddleware)

module.exports = app