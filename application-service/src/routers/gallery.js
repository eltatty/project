const express = require('express')
const router = new express.Router()
const Gallery = require('../models/gallery')
const User = require('../models/user')
const auth = require('../middleware/auth')

// Routes

//(1)
//------------PAGINATION
router.get('/galleries', auth, async (req, res) => {
    try {
        await req.user.populate('galleries').execPopulate()
        if(req.user.galleries === null) {
            return res.status(400).send('No galleries found')
        }
        res.send(req.user.galleries)
    } catch (e) {
        res.status(404).send()
    }

})

//(2)
router.get('/gallery/:id', auth, async (req, res) => {
    try{    
        const gallery = await Gallery.findOne({ _id: req.params.id, author: req.user._id})
        if(!gallery) {
            return res.status(404).send()
        }
        const images = await gallery.populate('images').execPopulate()
        res.send({gallery, images})
    } catch (e) {
        res.status(500).send()
    }
})

//(3)
//-------------PAGINATION
router.get('/friend/:id/galleries', auth, async (req, res) => {
    try {
        const friend = await User.findById(req.params.id)
        const exists = friend.friends.find((friendID) => friendID.equals(req.user._id))
        if(!exists) {
            return res.status(400).send('You don`t belong on his friends')
        }    
        await friend.populate('galleries').execPopulate()
        res.send(friend.galleries)
    } catch (e) {
        res.status(404).send()
    }
})

//(4)
//---------------PAGINATION
router.get('/friend/:idF/gallery/:idG', auth, async (req, res) => {
    try {
        const friend = await User.findById(req.params.idF)
        const exists = friend.friends.find((friendID) => friendID.equals(req.user._id))
        if(!exists) {
            return res.status(400).send('You don`t belong on his friends')
        }
        const gallery = await Gallery.findOne({ _id: req.params.idG, author: friend._id})
        res.send(gallery)
    } catch (e) {
        res.status(400).send()
    }
})

//(5)
router.post('/gallery/create', auth, async (req, res) => {
    const gallery = new Gallery({
        ...req.body,
        author:req.user._id
    })
    try {
        await gallery.save()
        res.status(201).send(gallery)
    } catch (e) {
        res.status(400).send(e)
    }
})

//(6)
router.delete('/gallery/delete/:id', auth, async (req, res) => {
    try{    
        const gallery = await Gallery.findOneAndDelete({  _id: req.params.id, author: req.user._id })
        if(!gallery) {
            return res.status(404).send()
        }
        res.send(gallery)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router