const express = require('express')
const app = express()

app.use(express.urlencoded({extended:true}))
app.set("view engine", "ejs")
app.use(express.static('public'))
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

app.listen(3000)
console.log("Server hosted at port 3000")