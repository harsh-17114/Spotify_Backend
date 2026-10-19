const userModel = require("../models/user.model.js")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")

// Register a new user
async function userRegisterController(req, res) {
    const { username, email, password, role = "user" } = req.body
    try {
        // Validate required fields
        if (!email || !password || !username) {
            return res.status(400).json({
                message: "Email, password and username are required"
            })
        }

        // Check if user already exists
        const isUserAlreadyExists = await userModel.findOne({
            $or: [{ username }, { email }]
        })

        // If the username or email is already registered, return an error
        if (isUserAlreadyExists) {
            return res.status(409).json({
                message: "User already exists"
            })
        }

        // Hash the user's password
        const hash = await bcrypt.hash(password, 10)

        // Create new user
        const user = await userModel.create({
            username,
            email,
            password: hash,
            role
        })

        // Generate JWT token
        const token = jwt.sign({
            id: user._id
        }, process.env.JWT_SECRET, {
            expiresIn: "3d"
        })

        // Store the token in cookie
        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production",
            maxAge: 3 * 24 * 60 * 60 * 1000
        })

        // Send successful registration response
        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        })
    }
    catch (err) {
        console.error("Registration error:", err)

        // Handle duplicate email race condition
        if (err.code === 11000) {
            return res.status(409).json({
                message: "User already exists with this email"
            })
        }

        // Return a server error response
        return res.status(500).json({
            message: "Internal server error"
        })
    }
}

// Login an existing user
async function userLoginController(req, res) {
    const { email, password } = req.body
    try {
        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            })
        }

        // Find user by username or email
        const user = await userModel.findOne({ email })

        // If no user is found, return an authentication error
        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            })
        }

        // Compare the entered password
        const isPasswordValid = await bcrypt.compare(password, user.password)

        // If the password is incorrect, return an authentication error
        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid email or password"
            })
        }

        // Generate JWT token
        const token = jwt.sign({
            id: user._id
        }, process.env.JWT_SECRET, {
            expiresIn: "3d"
        })

        // Store the token in cookie
        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production",
            maxAge: 3 * 24 * 60 * 60 * 1000
        })

        // Send successful login response
        res.status(200).json({
            message: "User logged in successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        })
    }
    catch (err) {
        console.error("Login error:", err)

        // Return a server error response
        return res.status(500).json({
            message: "Internal server error"
        })
    }
}

// Logout the current user
async function userLogoutController(req, res) {
    // Clear the authentication token cookie
    res.clearCookie("token", {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
    })

    // Send successful logout response
    res.status(200).json({
        message: "User logged out successfully"
    })
}

module.exports = { userRegisterController, userLoginController, userLogoutController }