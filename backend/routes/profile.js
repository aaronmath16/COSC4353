const express = require('express')
const router = express.Router()
const loggedIn = require('../passportauth').loggedIn
const loggedOut = require('../passportauth').loggedOut
const states = [ 'AL', 'AK', 'AS', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FM', 'FL', 'GA', 'GU', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MH', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'MP', 'OH', 'OK', 'OR', 'PW', 'PA', 'PR', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VI', 'VA', 'WA', 'WV', 'WI', 'WY' ];

router.get('/',loggedIn,(req,res) =>{
    res.render('profile')
})

router.post('/',loggedIn,(req,res) =>{
    const {fullname , address1 , address2, city, state , zipcode} = req.body
    if (fullname == undefined || address1 == undefined || address2 == undefined || city == undefined || state == undefined || zipcode == undefined){
        return res.render('profile.ejs',{error:'Missing input!'})
    }
    if (fullname.length > 50){
        error = "Name too long"
        return res.render('profile.ejs',{error:error})
    }
    if (address1.length > 100){
        error = "Address 1 too long"
        return res.render('profile.ejs',{error:error})
    }
    if (address2.length > 100){
        error = "Address 2 too long"
        return res.render('profile.ejs',{error:error})
    }
    if (city.length > 100){
        error = "City too long"
        return res.render('profile.ejs',{error:error})
    }
    if(!states.includes(state)){
        error = "Invalid State code"
        return res.render('profile.ejs',{error:error})
    }
    return res.render('quotePage.ejs')
    //todo zip code
    //clientside validations go here.  Consult the register js route for an example
})

module.exports = router