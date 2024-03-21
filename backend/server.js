const express = require('express')
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

//app.listen(3000)
console.log("Server hosted at port 3000")

module.exports = app