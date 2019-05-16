const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    }, 
    email: {
        type: String,
        unique: true,
        required: true,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error ('Email is invalid.')
            }
        }
    }, 
    password: {
        type:String, 
        required: true,
        minlength:8,
        trim:true
    }, 
    age: {
        type: Number,
        default: 18,
        validate(value){
            if(value < 18) {
                throw new Error('You must be an adult.')
            }
        }
    },
    friends: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
    }], 
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
},  {
    timestamps: true
},)

userSchema.virtual('galleries', {
    ref: 'Gallery',
    localField: '_id',
    foreignField: 'author'
})

userSchema.virtual('comments', {
    ref: 'Comment',
    localField: '_id',
    foreignField: 'userAuthor'
})


userSchema.methods.generateAuthToken = async function() {
    const user = this

    // const EncryptedMessage = {
    //     AuthId: 'AuthService',
    //     ServId: 'WebService',
    //     UserId: user._id,
    //     ValidTil: user.phone,
    //     Usermeta: {
    //         name: user.name,
    //         nick: user.nickname,
    //         email: user.email
    //     }
    // }
    //const EncrMess = JSON.stringify(EncryptedMessage)

    const token = jwt.sign({ _id: user._id.toString() }, 'messithegoat')

    user.tokens = user.tokens.concat({token})
    await user.save()
    
    // const TheToken = {
    //     issuer: "AuthService",
    //     crypted: token
    // }
    return token
}

userSchema.statics.findByName = async (name) => {
    const user = await User.findOne ({ name })

    if (!user) {
        throw new Error('Unable to find user')
    }

    return user
}

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })

    if (!user) {
        throw new Error('Unable to find email')
    }

    const isMatch = await bcrypt.compare(password, user.password)
    
    if(!isMatch) {
        throw new Error('Unable to find match')
    }
    return user
}

userSchema.pre('save', async function (next) {
    const user = this
    if(user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User