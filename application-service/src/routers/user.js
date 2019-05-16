const express = require('express')
const router = new express.Router()
const auth = require('../middleware/auth')
const User = require('../models/user')

// Routes


//(1)
router.get('/users', auth, async (req, res) => {
    try {
        const users = await User.find({})
        res.send(users)
    } catch (e) {
        console.log()
        res.status(500).send()
    }
})

//(2)
//----------------PAGINATION
router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})

//(3)
router.post('/user/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()

        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

//(4)
//--------------PAGINATION
router.get('/friends', auth, async (req, res) => {
    try {
        if (req.user.friends.length === 0) {
            return res.status(400).send('Forever alone')
        }
        await req.user.populate('friends').execPopulate()
        res.send(req.user.friends)
    } catch (e) {
        res.status(404).send()
    }
})

//(5)
//---------------PAGINATION
router.get('/friend/:id', auth, async (req, res) => {
    try {
        const exists = req.user.friends.find((friendID) => friendID.equals(req.params.id))
        if(!exists) {
            return res.status(400).send('User not a friend')
        }    

        const friend = await User.findById(req.params.id)
        res.send(friend)
    } catch (e) {
        res.status(404).send()
    }
})

//(6)
router.post('/friend/add/:id', auth, async (req, res) => {
    try {        
        const exists = await User.findById(req.params.id)
        if(!exists) {
            return res.status(400).send('User doesn`t exists')
        }

        const subject = await req.user.friends.find((friendID) => friendID.equals(req.params.id))
        if(subject) {
            return res.status(400).send('User already a friend')
        }
        req.user.friends.push(req.params.id)
        await req.user.save()
        res.send(req.user)
    } catch (e) {
        console.log(e)
        res.status(404).send()
    }
})

//(7)
router.delete('/friend/delete/:id', auth, async (req, res) => {
    try {        
        const exists = req.user.friends.find((friendID) => friendID.equals(req.params.id))
        if(!exists) {
            return res.status(400).send('User not a friend')
        }

        req.user.friends = req.user.friends.filter((friendID) => {
            return !(friendID.equals(req.params.id))
        })
        await req.user.save()
        res.send(req.user)
    } catch (e) {
        res.status(404).send()
    }
})

module.exports = router
