const passport = require ("passport")
const jwtStrategy = require ("passport-jwt").Strategy
const {ExtractJwt} = require ("passport-jwt")
const localStrategy = require ("passport-local").Strategy
const googleStrategy = require ("passport-google-plus-token")
const fbStrategy = require ("passport-facebook-token")
const {jwtSecret} = require ("./config")
const User = require ("./models/users")

passport.use (new jwtStrategy ({
    jwtFromRequest: ExtractJwt.fromHeader ("authorization"),
    secretOrKey: jwtSecret
}, async (payload, done) => {
    try {
        const user = await User.findById (payload.sub)

        if (!user) return done (null, false)

        return done(null, user)
    } catch (error) {
        done (error, false)
    }
}))

passport.use ("googleToken", new googleStrategy ({
    clientID: "GOOGLE_CLIENT_ID",
    clientSecret: "SECRET"
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const userExist = await User.findOne ({"google.id":profile.id})
        if (userExist) return done (null, userExist)

        console.log("Doesn't exist, create a new one")
        const addUser = new User ({
            method: "google",
            google: {
                id: profile.id,
                email: profile.emails[0].value
            }
        })

        await addUser.save ()
        done (null, addUser)
    } catch (error) {
        done (error, false, error.message)
    }
}))

passport.use ("fbToken", new fbStrategy ({
    clientID: "FB_CLIENT_ID",
    clientSecret: "SECRET"
}, async (accessToken, refreshToken, profile, done) => {
    try {
        console.log("accessToken", accessToken, "refreshToken", refreshToken, "profile", profile)
    
        const userExist = await User.findOne ({"facebook.id": profile.id})
        if (userExist) return done (null, userExist)
        
        const addUser = new User ({
            method: "facebook",
            facebook: {
                id: profile.id,
                email: profile.emails[0].value
            }
        })

        await addUser.save ()
        done (null, addUser)
    } catch (error) {
        done (error, false, error.message)
    }
}))

passport.use (new localStrategy ({
    usernameField: "email"
}, async (email, password, done) => {
    try {
        const user = await User.findOne ({"local.email": email})

        if (!user) return done (null, false)
        console.log(user)
        const validPass = await user.passValidation(password)

        if (!validPass) done (null, false)
        
        done (null, user)
    } catch (error) {
        done (error, false)
    }
}))