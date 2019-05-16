const mongoose = require('mongoose')

const gallerySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User' 
    }
},  {
    timestamps: true
})

gallerySchema.virtual('images', {
    ref: 'Image',
    localField: '_id',
    foreignField: 'galleryAuthor'
})

gallerySchema.virtual('comments', {
    ref: 'Comment',
    localField: '_id',
    foreignField: 'model'
})

const Gallery = mongoose.model('Gallery', gallerySchema)

module.exports = Gallery