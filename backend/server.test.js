const supertest = require('supertest')
const app = require( './server.js')
server = supertest.agent(app)

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
       username:"user",
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

    test('invalid repeat',(done) =>{
        server.post('/login').type('form').send({
            username:"testing",
            password:"123",
            repeatPw:"12"

        }).expect(302).end(()=>{
            done()
        })
    })

    test('valid password',(done) =>{
        server.post('/login').type('form').send({
            username:"testing",
            password:"testing",
            repeatPw:"testing"
        }).expect(200).end(()=>{
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
            city:"HoustoHoustonHoustonHoustonHoustonHoustonHoustonHoustonHoustonn",
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
/*     test('Invalid zip',(done) =>{
        server.post('/profile').type('form').send({
            fullname:"John Smith",
            address1:"123",
            address2:"123",
            city:"houston",
            state:'texas',
            zipcode:'772033334'
        }).expect(302).end(()=>{
            done()
        })
    }) */


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