const express = require('express')
const router = express.Router()

router.get('/',(req,res) =>{
    res.render('registerUser')
})

router.post('/',(req,res) =>{
    console.log(req.body)
    const {username , password , repeatPw} = req.body
    if (password !== repeatPw){
        return res.status(401).send("Passwords Do not Match!")
    }
/*  TEMP psuedocode
     if (username in GETUSERSFROMDB){
        return res.render('registerUser.ejs',{error:'Username in use!'})
    }     */
    //
    if (username.length > 50){
        error = "Username too long"
        return res.render('registerUser.ejs',{error:'Username Too Long'})
    }
    if (password.length > 50){
        return res.render('registerUser.ejs', {error : "PW too long"})
    }

    res.render('profile.ejs',{message:"Registration Sucessful!  Please fill in your profile details."})
})




module.exports = router