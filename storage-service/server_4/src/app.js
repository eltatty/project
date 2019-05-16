const express = require('express')
const fs = require('fs')
const multiparty = require('multiparty')
const uuid = require('uuid/v1')
const app = express()

app.use('/images',express.static('public'))

app.use(express.json())

app.get('/', (req, res) => {
    res.send('What`s up from server 4')
})

app.post('/upload', async (req, res) => {
    const form = new multiparty.Form() 
    form.parse(req)
    try {
        await form.on('part', (part) => {
            const fileName = uuid() + '.' + part.headers.originalname.split("").reverse().join("").split('.', 1).pop().split("").reverse().join("")
            part.pipe(fs.createWriteStream('./public/'+ fileName)).on('close', () => {
                res.status(200).send({ fileName, server: 6 })
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