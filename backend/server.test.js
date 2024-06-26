const supertest = require('supertest')
const app = require( './server.js')
server = supertest.agent(app)
const db = require( "./runDb")
const FuelPricing = require('./fuelquote.js')


const getUid = async () =>{

    await new Promise(function(resolve,reject){
        try{
            db.get(`select uid from user_credentials where username = 'TESTINGUSERNAME';`,[],(err,row)=>
            {
                if(err){
                console.error(err)
            }else{
                console.log(row[0])
                resolve(row[0])
            }})
          }catch(err){
            reject(err)
          }
      })
}

const cleanUp = async (uid) =>{

    return await new Promise(function(resolve,reject){
        try{

            db.run(`DELETE FROM quotes WHERE uid = (select uid from user_credentials where username = 'TESTINGUSERNAME');`,[uid],(err)=>
            {
                if(err){
                console.error(err)
            }})

            db.run(`DELETE FROM client_information WHERE uid = (select uid from user_credentials where username = 'TESTINGUSERNAME');`,[uid],(err)=>
            {
                if(err){
                console.error(err)
            }})
            
            db.run(`DELETE FROM user_credentials WHERE uid = (select uid from user_credentials where username = 'TESTINGUSERNAME');`,[],(err)=>
            {
                if(err){
                console.error(err)
            }})
        

        

          }catch(err){
            reject(err)
          }
          resolve(true)
      })


}


describe("GETS without login",()=>{

    test("/login",async() =>{
        const response = await server.get('/login')
        expect(response.statusCode).toBe(200)
    })

    test("/register",async() =>{
        const response = await server.get('/register')
        expect(response.statusCode).toBe(200)
    })

    test("/profile",async() =>{
        const response = await server.get('/profile')
        expect(response.statusCode).toBe(302)
        
    })

    test("/logout",async() =>{
        const response = await server.get('/logout')
        expect(response.statusCode).toBe(302)  
    })
})


describe("Basic Register POSTS",()=>{
    test("empty register",async() =>{
        const response = await server.post('/register')
        expect(response.statusCode).toBe(200)
    })

    test("long user",(done) =>{
         server.post('/register').type('form').send({
            username:"fiftyonecharactersistoolongfiftyonecharactersistoolong",
            password:"123",
            repeatPw:"123"
        }).expect(200)
        .expect("Location","Register")
        .end(()=>{
            done()
        })
    })

    test("long pass",(done) =>{
        server.post('/register').type('form').send({
           username:"user",
           password:"123123123123123123123123123123123123123123123123123123123123123123123123123123123",
           repeatPw:"123123123123123123123123123123123123123123123123123123123123123123123123123123123"
       }).expect(200)
       .expect("Location","Register")
       .end(()=>{
           done()
       })
   })

   test("success",(done) =>{

    server.post('/register').type('form').send({
       username:"TESTINGUSERNAME",
       password:"123",
       repeatPw:"123"
   }).expect(200)
   .expect("Location","Profile")
   .end(()=>{
    done()
   })
})





    test("wrongpass",(done) =>{
        server.post('/register').type('form').send({
           username:"user",
           password:"123",
           repeatPw:"13"
       }).expect(200)
       .expect("Location","Register")
       .end(()=>{
           done()
       })
   })
})


describe('Login POSTS',()=>{
    test('invalid user',(done) =>{
        server.post('/login').type('form').send({
            username:"not a real user",
            password:"123",
            repeatPw:"123"
        }).expect(302).end(()=>{
            done()
        })
    })
/*     test('invalid repeat',(done) =>{
        server.post('/login').type('form').send({
            username:"testing",
            password:"123",
            repeatPw:"12"

        }).expect(302).end(()=>{
            done()
        })
    }) */

    test('valid password',(done) =>{
        server.post('/login').type('form').send({
            username:"TESTINGUSERNAME",
            password:"123",
        }).expect(200).end(()=>{
            done()
        })
    })
})

describe('profile while logged in',()=>{

    test("profile while logged in",(done) =>{
        server.get('/profile').expect(200)
       .expect("Location","profile")
       .end(()=>{
           done()
       })
   })
})

describe('profile POSTS',()=>{
    test('Invalid name',(done) =>{
        server.post('/profile').type('form').send({
            fullname:"John Smith John Smith John Smith John Smith John Smith John Smith John Smith John Smith",
            address1:"123",
            address2:"123",
            city:"Houston",
            state:'TX',
            zipcode:'77204'
        }).expect(302).end(()=>{
            done()
        })
    })
    test('missing info',(done) =>{
        server.post('/profile').type('form').send({
            fullname:"John Smith",

        }).expect(302).end(()=>{
            done()
        })
    })
    test('Invalid address1',(done) =>{
        server.post('/profile').type('form').send({
            fullname:"John Smith",
            address1:"123123123123123123123123123123123123123123123123123123123123123123123123123123123123123123123123123123123123",
            address2:"123",
            city:"Houston",
            state:'TX',
            zipcode:'77204'
        }).expect(302).end(()=>{
            done()
        })
        
    })
    test('Invalid address2',(done) =>{
        server.post('/profile').type('form').send({
            fullname:"John Smith",
            address1:"123",
            address2:"123123123123123123123123123123123123123123123123123123123123123123123123123123123123123123123123123123123123",
            city:"Houston",
            state:'TX',
            zipcode:'77204'
        }).expect(302).end(()=>{
            done()
        })
    })

    test('Invalid city',(done) =>{
        server.post('/profile').type('form').send({
            fullname:"John Smith",
            address1:"123",
            address2:"123",
            city:"HoustoHoustonHoustoHoustonHoustonHoustonHoustonHoustonHoustonHoustonHoustonnHoustoHoustonHoustonHoustonHoustonHoustonHoustonHoustonHoustonnHoustonHoustonHoustonHoustonHoustonHoustonHoustonn",
            state:'TX',
            zipcode:'77204'
        }).expect(302).end(()=>{
            done()
        })
    })
    test('Invalid state',(done) =>{
        server.post('/profile').type('form').send({
            fullname:"John Smith",
            address1:"123",
            address2:"123",
            city:"houston",
            state:'texas',
            zipcode:'77204'
        }).expect(302).end(()=>{
            done()
        })
    })
//uncomment when zip is in
    test('Invalid zip',(done) =>{
        server.post('/profile').type('form').send({
            fullname:"John Smith",
            address1:"123",
            address2:"123",
            city:"houston",
            state:'TX',
            zipcode:'77203333444'
        }).expect(302).end(()=>{
            done()
        })
    })


    test('Valid Profile',(done) =>{
        server.post('/profile').type('form').send({
            fullname:"John Smith",
            address1:"123",
            address2:"123",
            city:"houston",
            state:'TX',
            zipcode:'77204'
        }).expect(302).end(()=>{
            done()
        })
    })

})




 describe('fuelhistory while logged in',()=>{

    test("fuelhistory while logged in",(done) =>{
        server.get('/fuelhistory').expect(200)
       .expect("Location","fuelhistory")
       .end(()=>{
           done()
       })
   })
})



 describe('quotepage while logged in',()=>{

    test("quotepage while logged in",(done) =>{
        server.get('/quotepage').expect(200)
       .expect("Location","quotepage")
       .end(()=>{
           done()
       })
   })

    test('Valid quote get',(done) =>{
        server.post('/quotePage/getQuoted').type('form').send({
            gallonsRequested:"123",
            deliveryDate:'2040-10-23',
            deliveryAddress:"Addre2s",
            city:"Houston",
            state:'TX',
            zipcode:'77204'
        }).expect(200).end((err)=>{
            if (err) return done(err)
            done()
        })
    })

    test('Valid quote get with above 1000',(done) =>{
        server.post('/quotePage/getQuoted').type('form').send({
            gallonsRequested:"2000",
            deliveryDate:'2040-10-23',
            deliveryAddress:"Addre2s",
            city:"Houston",
            state:'TX',
            zipcode:'77204'
        }).expect(200).end((err)=>{
            if (err) return done(err)
            done()
        })
    })

    test('Valid quote save',(done) =>{
        server.post('/quotePage/saveQuote').type('form').send({
            gallonsRequested:"123",
            deliveryDate:'2040-10-23',
            deliveryAddress:"Addre2s",
            city:"Houston",
            state:'TX',
            zipcode:'77204'
        }).expect(200).end((err)=>{
            if (err) return done(err)
            done()
        })
    })


    test('invalid date get',(done) =>{
        server.post('/quotePage/getQuoted').type('form').send({
            gallonsRequested:"100",
            deliveryAddress:"1234",
            deliveryDate:"not a real date",
            city:"Houston",
            state:'TX',
            zipcode:'77204'
        }).expect(302).end((err)=>{
            if (err) return done(err)
            done()
        })
    })

    test('invalid date save',(done) =>{
        server.post('/quotePage/saveQuote').type('form').send({
            gallonsRequested:"100",
            deliveryAddress:"1234",
            deliveryDate:"not a real date",
            city:"Houston",
            state:'TX',
            zipcode:'77204'
        }).expect(302).end((err)=>{
            if (err) return done(err)
            done()
        })
    })


    test('invalid gals get',(done) =>{
        server.post('/quotePage/getQuoted').type('form').send({
            gallonsRequested:"",
            deliveryAddress:"123",
            deliveryDate:"2024-04-04",
            city:"Houston",
            state:'TX',
            zipcode:'77204'
        }).expect(302).end((err)=>{
            if (err) return done(err)
            done()
        })
    })

    test('invalid gals save',(done) =>{
        server.post('/quotePage/saveQuote').type('form').send({
            gallonsRequested:"",
            deliveryAddress:"123",
            deliveryDate:"2024-04-04",
            city:"Houston",
            state:'TX',
            zipcode:'77204'
        }).expect(302).end((err)=>{
            if (err) return done(err)
            done()
        })
    })
}) 


describe('logout',()=>{
    test("logout",(done) =>{
        server.get('/logout').expect(200)
       .expect("Location","login")
       .end(()=>{
           done()
       })
   })
})


describe('proper margins',()=>{

    test("out of state",async() =>{
        quote = new FuelPricing(1,1001,'MN',false)
        expect(quote.getPrice()).toBe(1.74)
        await cleanUp(await getUid())
   })
})



