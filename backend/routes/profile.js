const express = require('express')
const router = express.Router()
const loggedIn = require('../passportauth').loggedIn
const loggedOut = require('../passportauth').loggedOut
const states = [ 'AL', 'AK', 'AS', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FM', 'FL', 'GA', 'GU', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MH', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'MP', 'OH', 'OK', 'OR', 'PW', 'PA', 'PR', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VI', 'VA', 'WA', 'WV', 'WI', 'WY' ];
const mockdb = require('../mockdb')
const mockProfile = mockdb.profile
const sqlite3 = require('sqlite3').verbose()


var delivAddress = "614 Default Rd"

var mockprofile = mockProfile[0]
var name = null
var address = null
var address2 = null
var city = null
var state = null
var zipcode = null
router.get('/',loggedIn, Info, (req,res) =>{
    res.render('profile', {error: '', fullname: name, address1:address, address2: address2, city: city, state: state, zipcode: zipcode})
})

router.post('/',loggedIn,(req,res) =>{
    const {fullname , address1 , address2, city, state , zipcode} = req.body
    if (fullname == '' || address1 == '' || city == '' || state == '' || zipcode == ''){
        return res.render('profile.ejs',{error:'Missing input!', fullname: fullname, address1: address1, address2:address2, city: city, state: state, zipcode: zipcode})
    }

    const db = new sqlite3.Database('data.db', (err) => {
        if (err) {
            console.error('Error connecting to database:', err.message);
        }
        else{
            console.log('Connected to the database.');
        }
    });

    const sql = 'INSERT into client_information ('fullname, address1, address2, city, state, zipcode) VALUES(?,?,?,?,?,?)'

    db.run(sql, [name, address, address2, city, state, zipcode], (err) => {
        if (err){
            console.error('Error inserting info: ', err.message)
        }
        else{
            console.log('Info inserted')
        }
    })

    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err.message);
        }
        else{
            console.log('Database connection closed.');
        }
    });

    if (fullname.length > 50){
        error = "Name too long"
        return res.render('profile.ejs',{error:error, address1: address1, address2:address2, city: city, state: state, zipcode: zipcode})
    }
    if (address1.length > 100){
        error = "Address 1 too long"
        return res.render('profile.ejs',{error:error, fullname: fullname, address2:address2, city: city, state: state, zipcode: zipcode})
    }
    if (address2.length > 100){
        error = "Address 2 too long"
        return res.render('profile.ejs',{error:error, fullname: fullname, address1: address1, city: city, state: state, zipcode: zipcode})
    }
    if (city.length > 100){
        error = "City too long"
        return res.render('profile.ejs',{error:error, fullname: fullname, address1: address1, address2:address2, state: state, zipcode: zipcode})
    }
    if(!states.includes(state)){
        error = "Invalid State code"
        return res.render('profile.ejs',{error:error, fullname: fullname, address1: address1, address2:address2, city: city, zipcode: zipcode})
    }
    if(zipcode.length < 5 || zipcode.length > 9){
        error = "Invalid zip code"
        return res.render('profile.ejs',{error:error, fullname: fullname, address1: address1, address2:address2, city: city, state: state})
    }
    return res.render('quotePage.ejs', {delivAddress: delivAddress})
})

function Info(req, res, next) {
    name = mockprofile.fullName
    address = mockprofile.address1
    address2 = mockprofile.address2
    city = mockprofile.city
    state = mockprofile.state
    zipcode = mockprofile.zipcode
    next()
}

module.exports = router