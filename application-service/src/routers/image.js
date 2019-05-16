const express = require('express')
const multer = require('multer')
const uploadFunc = require('../utils/uploadFunc')
const deleteFunc = require('../utils/deleteFunc')
const router = new express.Router()
const User = require('../models/user')
const Image = require('../models/image')
const Gallery = require('../models/gallery')
const auth = require('../middleware/auth')

const upload = multer({
    limits: {
        fileSize: 1000000        
    },
    fileFilter(req, file, cb) {
        if(!file.originalname.match(/\.(jpeg|jpg|png|gif)$/)){
            return cb(new Error('Please upload an image'))
        }
        cb(undefined, true)
    }
})



// Routes


//---------------------PAGINATION
// router.get('/images', auth, async (req, res) => {
//     //const me = await Gallery.findById('5cd00af97e37de2fa46b5b9c')
//     try {
//         const user = await User.findById(req.user._id)
//         await me.populate('images').execPopulate()
//         if(me.images === null) {
//             return res.status(400).send('No galleries found')
//         }
//         res.send(me.images)
//     } catch (e) {
//         res.status(404).send()
//     }
// })

//(1)
router.get('/gallery/:idG/image/:idI', auth, async (req, res) => {
    try {
        const gallery = await Gallery.findById(req.params.idG)
        if(!gallery.author.equals(req.user._id)) {
            return res.status(404).send('You have no access.')
        }
        const image = await Image.findOne({ _id: req.params.idI, galleryAuthor: gallery._id})
        res.send(image)
    } catch (e) {
        res.status(500).send()
    }
})

//(2)
router.get('/friend/:idF/image/:idI', auth, async (req, res) => {
    try {
        const friend = await User.findById(req.params.idF)
        const exists = friend.friends.find((friendID) => friendID.equals(req.user._id))
        if(!exists) {
            return res.status(400).send('You don`t have access')
        }
        const image = await Image.findById(req.params.idI)
        res.send(image)
    } catch (e) {
        res.status(400).send()
    }
})

//(3)
router.post('/create/gallery/:id/image', auth, upload.single('upload'), async (req, res) => {
    try {
        const gallery = await Gallery.findById(req.params.id)
        if(!gallery.author.equals(req.user._id)) {
            return res.status(404).send('You have no access.')
        }

        //const urls = [3, 4, 5, 6, 7]
        //const num = urls [Math.floor(Math.random() * urls.length)]

        const num1 = 3
        const num2 = 4

        const image = new Image({
            name:req.body.name,
            ...req.file,
            galleryAuthor: gallery._id
        }) 

        await uploadFunc(req.file, num1, async (error, { server, fileName } = {}) => {
            if (error) {
                res.status(400).send(error)
            }
            await image.storeToServer(server, fileName)         
        })
        res.send(image)
    } catch (e) {
        res.status(400).send()
    }

}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

//(4)
router.delete('/delete/gallery/:idG/image/:idI', auth, async (req, res) => {
    try{    
        const gallery = await Gallery.findById(req.params.idG)
        if(!gallery.author.equals(req.user._id)) {
            return res.status(404).send('You have no access.')
        }

        const image = await Image.findById(req.params.idI)
        
        deleteFunc(image.filenames, image.servers, (error, body) => {
            if(error){
                console.log('Image error: ' + error)
            }
            // await image.delete()
            
        })
        // if(deleteFunc(image.filenames, image.servers)) {
        //     await image.delete()
        // }

        res.send('Image deleted.')
    } catch (e) {
        console.log(e)
        res.status(500).send()
    }
})


module.exports = router