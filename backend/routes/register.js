const express = require('express')
const router = express.Router()
const loggedIn = require('../passportauth').loggedIn
const loggedOut = require('../passportauth').loggedOut
const bcrypt = require('bcrypt')



/* const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('data.db', (err) => {
    if (err) {
      console.error('Error connecting to database:', err.message);
    } else {
      console.log('Connected to the database.');
    }
  });

db.run("PRAGMA foreign_keys = ON;")
 */
const db = require( "../runDb")


const existsUser = (username) =>{
    //check if the user exists
    //wrapped in a promise + try catch block because sqlite doesnt seem to support async properly
    return new Promise(function(resolve,reject){
    try{
      db.all(`SELECT * FROM user_credentials WHERE username = ?`,[username],async function(err,rows) {
        if (err) {
          reject(console.error('Error getting user:', err.message))
        }
        if (rows.length ==0){
          console.log(`User does not exist`);

          resolve(false)
        }else{
          //console.log(rows[0])
          console.log(`User exists`);
          resolve(rows[0])
          
        }
      })}catch(err){
        reject(err)

      }
}
    )}


const createUser = async (username,password) =>{
    //use bcrypt to hash pw
    //send user and hashed pw into the DB

    const hashedPw = await bcrypt.hash(password,10)

    await new Promise(function(resolve,reject){
      try{
        db.all(`INSERT INTO user_credentials(username,password) VALUES ($1,$2)`,[username,hashedPw],async function(err,rows) {
          if (err) {
            reject(console.error('Error inserting:', err.message))
          }
          if (rows.length ==0){
            console.log(`couldnt insert`);
            resolve(false)
          }else{
            //console.log(rows[0])
            console.log(`User inserted`);
            resolve(rows[0])
          }
        })}catch(err){
          reject(err)
        }
    })

/*     const result = db.all(`INSERT INTO user_credentials(username,password) VALUES ($1,$2)`,[username,hashedPw],function(err,rows) {
        if (err) {
          return console.error('Error inserting:', err.message);
        }
        if(rows.length == 0){
            return false
        }
        else{
            console.log(`insert successful!`);

            return rows[0]
        }
      }) */
    //const result = await pool.query(`INSERT INTO user_credentials(username,password) VALUES ($1,$2)`,[username,hashedPw])

}



router.get('/',loggedOut,(req,res) =>{
    res.render('registerUser')
})

router.post('/',loggedOut, async (req,res) =>{
    console.log(req.body)
    const {username , password , repeatPw} = req.body
    console.log(username)
    if (username == '' || password == '' || repeatPw == '' || username == undefined || password == undefined || repeatPw == undefined){
        return res.render('registerUser.ejs',{error:'Missing input!'})
    }
    if (password !== repeatPw){
        return res.render('registerUser.ejs',{error:"Passwords Don't match!"})
    }
/*  TEMP psuedocode
     if (username in GETUSERSFROMDB){
        return res.render('registerUser.ejs',{error:'Username in use!'})
    }     */
    if (await existsUser(username)){
        return res.render('registerUser.ejs',{error:'Username in use!'})
    }     
    if (username.length > 50){
        error = "Username too long"
        return res.render('registerUser.ejs',{error:'Username Too Long'})
    }
    if (password.length > 50){
        return res.render('registerUser.ejs', {error : "PW too long"})
    }

    await createUser(username,password)
    res.render('login.ejs',{message:"Registration Sucessful!  Please log in and fill in your profile details.", error:''})
})




module.exports = router