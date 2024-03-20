const express = require('express')
const router = express.Router()
//temp
router.get('/',(req,res) =>{
    //Probably going to use passport or something simpler for login auth.
    res.render('login.ejs',{message:"Logged out"})
})
router.post('/',(req,res) =>{
    //Probably going to use passport or something simpler for login auth.
})
module.exports = router