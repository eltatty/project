const express = require('express')
const fs = require('fs')
const multiparty = require('multiparty')
const uuid = require('uuid/v1')
const app = express()
require('./db/mongoose')
const jwt = require('jsonwebtoken')
const User = require('./models/user')
const Gallery = require('./models/gallery')
const Image = require('./models/image')

app.use('/images/:filename', async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, 'messithegoat')
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })
        const image = await Image.findOne({'filenames.filename': req.params.filename})
        const gallery = await Gallery.findById(image.galleryAuthor)
        const owner = await User.findById(gallery.author)
        const exists = owner.friends.find((friendID) => friendID.equals(user._id))
        if(!(exists || owner._id.equals(user._id))) {   
            return res.status(400).send({ error: 'You have no access.' })
        }
        next()
    } catch (e) {
        res.status(404).send()
    }
})
app.use('/images',express.static('public'))

app.use(express.json())

app.get('/', async (req, res) => {
    res.send('What`s up from server 2')
})

app.delete('/delete/:filename/:inToken', (req, res) => {
    try{
        console.log(req.params.inToken)
        const keyWord = jwt.verify(req.params.inToken, 'messithegoat')
        console.log(keyWord)
        if(!fs.existsSync('./public/' + req.params.filename)){
            throw new Error('File doesn`t exists')
        }
        fs.unlinkSync('./public/' + req.params.filename)
        res.send('Removed Successfully!')
        
    } catch (e) {
        res.status(500).send(e)
    }
})


app.post('/upload', async (req, res) => {
    const form = new multiparty.Form() 
    form.parse(req)
    try {
        await form.on('part', (part) => {
            if(!(part.headers.source === 'Application-Server')) {
                return res.status(400).send({ error: 'You have no access.' })
            }
            const fileName = uuid() + '.' + part.headers.originalname.split("").reverse().join("").split('.', 1).pop().split("").reverse().join("")
            part.pipe(fs.createWriteStream('./public/'+ fileName)).on('close', () => {
                res.status(200).send({ fileName, server: 4 })
            })
        })
    } catch (e) {
        res.status(400).send()
    }

}, (error, req, res, next) => {
    // console.log(error)
    res.status(400).send({ error: error.message })
})



module.exports = app