const mongoose = require('mongoose')

const imageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    originalname: {
        type: String,
        required: true
    },
    encoding: {
        type: String,
        required: true
    },
    mimetype: {
        type: String,
        required: true
    },
    size: {
        type: Number,
        required: true
    },
    servers: [{
        server: {
            type: Number,
            required: true
        }
    }],
    filenames: [{
        filename: {
            type: String,
            required: true
        }
    }],
    urls: [{
        url: {
            type: String,
            required: true
        }
    }],
    galleryAuthor: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Gallery'
    }
}, {
    timestamps: true
},)

imageSchema.virtual('comments', {
    ref: 'Comment',
    localField: '_id',
    foreignField: 'model'
})


imageSchema.methods.storeToServer = async function ( server, filename ) {
    const image = this

    image.servers = image.servers.concat({ server })
    image.filenames = image.filenames.concat({ filename })
    const url = 'http://localhost:300' + server + '/images/' + filename 
    image.urls = image.urls.concat({ url })

    await image.save()
}

const Image = mongoose.model('Image', imageSchema)

module.exports = Image