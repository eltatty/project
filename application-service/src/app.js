const express = require('express')
require('./db/mongoose')

const userRouter = require('./routers/user')
const galleryRouter = require('./routers/gallery')
const imageRouter = require('./routers/image')
const commentRouter = require('./routers/comment')

const app = express()

app.get('/', (req, res) => {
    res.send('Application Logic')
})

app.use(express.json())
app.use(userRouter)
app.use(galleryRouter)
app.use(imageRouter)
app.use(commentRouter)

module.exports = app