//const express = require ("express")
const router = require ("express-promise-router")()
const passport = require ("passport")
const {validateBody, schemas} = require ("../helpers/routes-helper")
const controllers = require ("../controllers/users")
const myPassport = require ("../passport")

router.route("/signUp")
.post(validateBody(schemas.authSchema), controllers.signUp)

router.route("/signIn")
.post(validateBody(schemas.authSchema), passport.authenticate("local", {session: false}), controllers.signIn)

router.route("/secret")
.get(passport.authenticate("jwt", {session: false}), controllers.secret)

router.route("/oauth/google")
.post(passport.authenticate("googleToken", {session: false}), controllers.google)

router.route("/oauth/facebook")
.post(passport.authenticate("fbToken", {session: false}), controllers.facebook)

module.exports = router