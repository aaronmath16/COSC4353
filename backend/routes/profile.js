const express = require('express')
const router = express.Router()

router.get('/',(req,res) =>{
    res.render('profile')
})

router.post('/',(req,res) =>{
    //clientside validations go here.  Consult the register js route for an example
})

module.exports = router