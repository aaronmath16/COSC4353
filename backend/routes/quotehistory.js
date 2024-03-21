const express = require('express')
const router = express.Router()
const loggedIn = require('../passportauth').loggedIn
const loggedOut = require('../passportauth').loggedOut
router.get('/',loggedIn,(req,res) =>{
    res.render('fuelhistory')
})

//This one might be a bit tricky especially without the DB put in yet.  Maybe a mock DB can be put in here alone and then use EJS to dynamically fill the tables with that info.

document.addEventListener('DOMContentLoaded', function () {
    fetch('/fuelhistory') // Fetch data from the backend endpoint
        .then(response => response.json())
        .then(data => {
            // Clear existing table rows
            const tableBody = document.querySelector('#purchases tbody');
            tableBody.innerHTML = '';

            // Populate table with fetched data
            data.forEach(entry => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${entry.name}</td>
                    <td>${entry.gallonsRequested}</td>
                    <td>${entry.deliveryDate}</td>
                    <td>${entry.deliveryAddress}</td>
                    <td>${entry.suggestedPrice}</td>
                    <td>${entry.total}</td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error fetching fuel history:', error);
        });
});


module.exports = router