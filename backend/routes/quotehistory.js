const express = require('express')
const router = express.Router()
const loggedIn = require('../passportauth').loggedIn
const loggedOut = require('../passportauth').loggedOut
const mockdb = require('../mockdb')
const mockhistory = mockdb.history

var tableEntries = mockhistory
var tableHtml = ''

router.get('/',loggedIn, popHistory, (req,res) =>{
    res.render('fuelhistory.ejs', {table: tableHtml})
})

//This one might be a bit tricky especially without the DB put in yet.  Maybe a mock DB can be put in here alone and then use EJS to dynamically fill the tables with that info.

function popHistory(req, res, next) {
    // Clear existing table rows
    tableHtml = ''

    // Populate table with fetched data
    try{
        tableEntries.forEach(entry =>{
                tableHtml += "<tr><td>" + entry.name + 
                "</td><td>" + entry.gallonsRequested + 
                "</td><td>" + entry.deliveryDate + 
                "</td><td>" + entry.deliveryAddress + 
                "</td><td> " + "$" + entry.suggestedPrice + 
                "</td><td>" + "$" + entry.total + "</td></tr>";
        })
    }catch(error) {
        console.error('Error fetching fuel history:', error);
    }
    next()
}


module.exports = router