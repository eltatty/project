const mongoose = require ('mongoose')

const commentSchema = new mongoose.Schema({
    context: {
        type: String,
        required: true,
        maxlength: 1024
    },
    userAuthor: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    model: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refpath: 'modelEnum'
    },
    modelEnum: {
        type: String,
        required: true,
        enum: ['Image', 'Gallery']
    }

},{
    timestamps: true
})

const Comment = mongoose.model('Comment', commentSchema)

module.exports = Comment