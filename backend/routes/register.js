const express = require('express')
const router = express.Router()
const loggedIn = require('../passportauth').loggedIn
const loggedOut = require('../passportauth').loggedOut
router.get('/',loggedOut,(req,res) =>{
    res.render('registerUser')
})

router.post('/',loggedOut,(req,res) =>{
    console.log(req.body)
    const {username , password , repeatPw} = req.body
    console.log(username)
    if (username == '' || password == '' || repeatPw == '' || username == undefined || password == undefined || repeatPw == undefined){
        return res.render('registerUser.ejs',{error:'Missing input!'})
    }
    if (password !== repeatPw){
        return res.render('registerUser.ejs',{error:"Passwords Don't match!"})
    }
/*  TEMP psuedocode
     if (username in GETUSERSFROMDB){
        return res.render('registerUser.ejs',{error:'Username in use!'})
    }     */
    //hardcoded version of above
    if (username =="testing"){
        return res.render('registerUser.ejs',{error:'Username in use!'})
    }     
    if (username.length > 50){
        error = "Username too long"
        return res.render('registerUser.ejs',{error:'Username Too Long'})
    }
    if (password.length > 50){
        return res.render('registerUser.ejs', {error : "PW too long"})
    }

    res.render('profile.ejs',{message:"Registration Sucessful!  Please fill in your profile details.", error:''})
})




module.exports = router