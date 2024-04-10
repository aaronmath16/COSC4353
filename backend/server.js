const express = require('express')
const sqlite3 = require('sqlite3').verbose()
const app = express()
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
app.use(express.urlencoded({extended:true}))
app.set("view engine", "ejs")
app.use(flash());

app.use(session({
    secret:"temp",
    resave:false,
    saveUninitialized: false
}))

app.use(express.static('public'))

require('../backend/passport')
app.use(passport.initialize())
app.use(passport.session())

app.get('/', (req, res) => {
    res.render('login')
})


const registerRouter = require('./routes/register')

const loginRouter = require('./routes/login')
const logoutRouter = require('./routes/logout')

const profileRouter = require('./routes/profile')
const fuelhistoryRouter = require('./routes/quotehistory')
const quoteRouter = require('./routes/getquote')

app.use('/register',registerRouter)
app.use('/login',loginRouter)
app.use('/profile',profileRouter)
app.use('/fuelhistory',fuelhistoryRouter)
app.use('/quotePage',quoteRouter)
app.use('/logout',logoutRouter)

// Connect to the SQLite database
const db = new sqlite3.Database('data.db', (err) => {
    if (err) {
      console.error('Error connecting to database:', err.message);
    } else {
      console.log('Connected to the database.');
    }
  });
  
  // Create tables if not exist
db.run(`CREATE TABLE IF NOT EXISTS user_credentials
    (uid INTEGER PRIMARY KEY,
    username CHAR(100) NOT NULL UNIQUE,
    password CHAR(100) NOT NULL
  )`);
  
db.run(`CREATE TABLE IF NOT EXISTS client_information (
      client_id INTEGER PRIMARY KEY AUTOINCREMENT,
      uid INTEGER REFERENCES user_credentials(uid),
      name CHAR(200) NOT NULL,
      address1 CHAR(100) NOT NULL,
      address2 CHAR(100),
      city CHAR(100) NOT NULL,
      state CHAR(2) NOT NULL,
      zip INTEGER NOT NULL
  )`);
  
db.run(`CREATE TABLE IF NOT EXISTS quotes
    (quote_id INTEGER PRIMARY KEY AUTOINCREMENT,
    uid INTEGER REFERENCES user_credentials(uid),
    gallons_requested INTEGER NOT NULL,
    delivery_date DATE NOT NULL,
    address CHAR(311) NOT NULL,
    total_price NUMERIC NOT NULL,
    fee NUMERIC NOT NULL
  )`);
  
db.run(`CREATE TABLE IF NOT EXISTS states
    (state CHAR(25) PRIMARY KEY,
    abbr CHAR(2) UNIQUE NOT NULL
  )`);



db.close((err) => {
    if (err) {
      console.error('Error closing database:', err.message);
    } else {
      console.log('Database connection closed.');
    }
  });
//moved to a new file so testing can be done without hosting the server.
//app.listen(3000)
//console.log("Server hosted at port 3000")

module.exports = app