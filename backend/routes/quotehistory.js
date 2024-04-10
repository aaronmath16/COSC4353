const express = require('express')
const router = express.Router()
const loggedIn = require('../passportauth').loggedIn
const loggedOut = require('../passportauth').loggedOut
const mockdb = require('../mockdb')
const mockhistory = mockdb.history
const sqlite3 = require('sqlite3').verbose()

var tableEntries = mockhistory
var tableHtml = ''

router.get('/',loggedIn,popHistory, (req,res) =>{        
    res.render('fuelhistory.ejs', {table: tableHtml})

})

const db = new sqlite3.Database('data.db', (err) => {
    if (err) {
      console.error('Error connecting to database:', err.message);
    } else {
      console.log('Connected to the database.');
    }
  });

tableHtml =''

db.all(sql, [], (err, rows) => {
    if (err) return console.error(err.message);

    rows.forEach((row) => {
        tableHtml += "<tr><td>" + entry.name + 
                "</td><td>" + entry.gallonsRequested + 
                "</td><td>" + entry.deliveryDate + 
                "</td><td>" + entry.deliveryAddress + 
                "</td><td> " + "$" + entry.suggestedPrice + 
                "</td><td>" + "$" + entry.total + "</td></tr>";
    });
});


/*function popHistory(req, res, next) {
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
        res.redirect('quotePage.ejs',{error: "Error Fetching fuel history."})
    }
    next()
}*/


db.close((err) => {
    if (err) {
      console.error('Error closing database:', err.message);
    } else {
      console.log('Database connection closed.');
    }
    });


module.exports = router