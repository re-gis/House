const passport = require('passport')

const googleAuth = async (req, res) => {
    passport.authenticate('google', { scope: ["email", "profile"]})
}


const succeccFailureAuth = async(req, res) => {
    passport.authenticate("google", {
        successRedirect: '/login',
        failureRedirect: '/auth/failure'
    })
}

const authFailure = async(req, res) => {
    res.json({ message: 'GoogleAuth error...' })
}

module.exports = {
    googleAuth,
    succeccFailureAuth,
    authFailure
}