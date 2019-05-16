const express = require('express')
const router = new express.Router()
const User = require('../models/user')
const Gallery = require('../models/gallery')
const Image = require('../models/image')
const Comment = require('../models/comment')
const auth = require('../middleware/auth')

//Routes

//(1)
//---------------PAGINATION
router.get('/comments', auth, async (req, res) => {
    try {
        await req.user.populate('comments').execPopulate()
        if(req.user.comments === null) {
            return res.status(400).send('No comments found')
        }
        res.send(req.user.comments)
    } catch (e) {
        res.status(404).send()
    }
})

//(2)
router.post('/comment/create', auth, async (req, res) => {
    try {
        if(req.body.modelEnum === 'Gallery') {
            const gallery = await Gallery.findById(req.body.model) 
            const friend = await User.findById(gallery.author)
            const exists = friend.friends.find((friendID) => friendID.equals(req.user._id))
            if(!(exists || friend._id.equals(req.user._id))) {   
                return res.status(400).send('You can`t add a comment here.')
            }
            const comment = new Comment({
                ...req.body,
                userAuthor: req.user._id
            })
            await comment.save()
        } else if (req.body.modelEnum === 'Image') {
            const image = await Image.findById(req.body.model)
            const gallery = await Gallery.findById(image.galleryAuthor)
            const friend = await User.findById(gallery.author)
            const exists = friend.friends.find((friendID) => friendID.equals(req.user._id))
            if(!(exists || friend._id.equals(req.user._id))) {   
                return res.status(400).send('You can`t add a comment here.')
            }
            const comment = new Comment({
                ...req.body,
                userAuthor: req.user._id
            })
            await comment.save()
        } else {
            return res.status(404).send('Invalid model')
        }
        res.send('Comment Created')
    } catch (e) {
        res.status(400).send()
    }
})

//(3)
router.delete('/comment/delete/:id', auth, async (req, res) => {
    try{
        const comment = await Comment.findById(req.params.id)
        if(comment.modelEnum === 'Gallery') {
            const gallery = await Gallery.findById(comment.model)
            const friend = await User.findById(gallery.author)
            const exists = friend.friends.find((friendID) => friendID.equals(req.user._id))
            if(!(exists || friend._id.equals(req.user._id))) {   
                return res.status(400).send('You can`t delete this comment')
            }
            await comment.delete()
        } else if (comment.modelEnum === 'Image') {
            const image = await Image.findById(comment.model)
            const gallery = await Gallery.findById(image.galleryAuthor)
            const friend = await User.findById(gallery.author)
            const exists = friend.friends.find((friendID) => friendID.equals(req.user._id))
            if(!(exists || friend._id.equals(req.user._id))) {   
                return res.status(400).send('You can`t delete this comment')
            }
            await comment.delete()
        }
        res.send('Comment Deleted')
    } catch (e) {
        res.status(500).send()
    }
})


module.exports = router