const express = require('express')

const app = express()
app.use(express.json())

app.get('/main', (req, res) => {
    res.send('Main Page from web service')
})

module.exports = app

