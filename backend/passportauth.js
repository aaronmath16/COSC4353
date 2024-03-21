//fns to make sure logged in users dont see login page, and
module.exports.loggedIn = (req,res,next) =>{
    if (req.isAuthenticated()){
        return next()
    }
    res.redirect('/login')
}

module.exports.loggedOut = (req,res,next) =>{
    if (req.isAuthenticated()){
        res.redirect('/profile')
    }
    return next()

}