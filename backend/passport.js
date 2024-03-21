const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const mockdb = require('./mockdb')
const mockusers = mockdb.users
console.log(mockusers)
passport.use(new LocalStrategy(
    async (username,password,done) =>{
        const user = mockusers.find(n => n.username === username);
        if(!user){
            return done(null,false,{message:'User not found'})
        }
        if (await bcrypt.compare(password,user.password)){
            return done(null,user)
        }else{
            console.log(await bcrypt.compare(password,user.password))
            console.log(await bcrypt.hash('testing',10))

            return done(null,false,{message:"Wrong Password"})
        }
    }
))

passport.serializeUser((user,done) =>{
    done(null,user.uid);
})
passport.deserializeUser((uid,done) =>{
    const user = mockusers.find(x => x.uid === uid)
    done(null,user)
})
