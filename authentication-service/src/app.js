const express = require('express')
const jwt = require('jsonwebtoken')
const User = require ('../models/user')
//const auth = require('../middleware/auth')
require('../db/mongoose')
const app = express()


app.use(express.json())

app.post('/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token  = await user.generateAuthToken()
        //res.redirect('http://localhost:3000/users/me')
        res.status(200).send({ user, token })
    } catch (e) {
        res.status(400).send()
    }
})

app.post('/signup', async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        const token = await user.generateAuthToken()
        //res.redirect('http://localhost:3000/users/me')
        res.status(201).send({ user, token })
    } catch (e) {
        res.status(400).send(e)
    }
})


module.exports = app