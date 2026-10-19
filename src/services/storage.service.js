const ImageKit = require("@imagekit/nodejs")

// Create ImageKit client
const client = new ImageKit({ privateKey: process.env.IMAGE_KIT_KEY })

// Upload music file
async function uploadFile(file) {
    try {
        const response = await client.files.upload({
            file,
            fileName: "music_" + Date.now(),
            folder: "music"
        })
        return response
    }
    catch (err) {
        console.error("ImageKit upload error:", err)
        throw err
    }
}

// Delete music file
async function deleteFile(fileId) {
    try {
        await client.files.delete(fileId)
    }
    catch (err) {
        console.error("ImageKit delete error:", err)
    }
}

module.exports = { uploadFile, deleteFile }