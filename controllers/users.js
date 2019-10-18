const jwt = require ("jsonwebtoken")
const User = require ("../models/users")
const { jwtSecret } = require ("../config")

const signToken = (id) => {
    console.log(jwtSecret)
    return jwt.sign({
        iss: "copudding",
        sub: id,
        iat: new Date().getTime(),
        exp: new Date().setDate(new Date().getDate() + 1)
    }, jwtSecret)
    
} 

module.exports = {
    signUp: async (req, res, next) => {
        const {email, password} = req.value.body

        const userExist = await User.findOne({"local.email":email})
        if (userExist) return res.status(409).send({ERROR: "User already exist."})

        const newUser = new User({
            method: "local",
            local: {
                email: email,
                password: password
            }
        })
        await newUser.save()

        const token = signToken(newUser.id)
        res.status(200).send({token})
        return next()
    },
    signIn: async (req, res, next) => {
        console.log(req.user)
        const token = signToken (req.user.id)
        res.status(200).send({token})
    },
    secret: async (req, res, next) => {
        res.status(200).send({secret: "your_secret"})
    },
    google: async (req, res, next) => {
        console.log(req)
        const token = signToken (req.user.id)
        res.status(200).send({token})
    },
    facebook: async (req, res, next) => {
        const token = signToken (req.user.id)
        res.status(200).send({token})
    }
}