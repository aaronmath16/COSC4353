const express = require('express')
const router = express.Router()
const loggedIn = require('../passportauth').loggedIn
const loggedOut = require('../passportauth').loggedOut
router.get('/',loggedIn,(req,res,next) =>{
    req.logout((err) =>{
        if (err) {
            return next(err)
        }
        res.render('login.ejs',{message:"Logged out"})})
})
router.post('/',(req,res) =>{
    //Remove soon?
})
module.exports = router