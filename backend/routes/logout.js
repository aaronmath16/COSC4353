const express = require('express')
const router = express.Router()
const loggedIn = require('../passportauth').loggedIn
const loggedOut = require('../passportauth').loggedOut
//temp
router.get('/',loggedIn,(req,res,next) =>{
    //Probably going to use passport or something simpler for login auth.
    req.logout((err) =>{
        if (err) {
            return next(err)
        }
        res.render('login.ejs',{message:"Logged out"})})
})
router.post('/',(req,res) =>{
    //Probably going to use passport or something simpler for login auth.
})
module.exports = router