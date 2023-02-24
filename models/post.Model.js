const mongoose = require('mongoose')
const postModel = mongoose.Schema

const postSchema = new postModel({
    agentId: mongoose.Types.ObjectId,
    location: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    cloudinary_id: {
        type: String,
    },
    video: {
        type: String
    },
    taken: {
        type: String,
        default: 'Available'
    }
}, {
    timestamps: true
})

module.exports.Post = mongoose.model('Post', postSchema)