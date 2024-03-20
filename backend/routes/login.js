const express = require('express')
const router = express.Router()

router.get('/',(req,res) =>{
    res.render('login')
})
router.post('/',(req,res) =>{
    //Probably going to use passport or something simpler for login auth.
})
module.exports = router