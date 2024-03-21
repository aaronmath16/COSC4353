const mockusers = [
    {
        uid:1,
        username:"testing",
        password:'$2b$10$XOZ93p5Rn3Xq2eJU2dSGReCycnECRIsFk/eSDlKa3MEG1PHScVESe' //this is 'testing' but hashed with 10 cost factor
    }
]

const mockhistory = [
    {
        name : "Aaron",
        gallonsRequested : 20,
        deliveryDate : Date('1/21/22'),
        deliveryAddress : "University of Houston",
        suggestedPrice : 100,
        total : 200
    },
    {
        name : "Aliyan",
        gallonsRequested : 15,
        deliveryDate : Date('4/30/25'),
        deliveryAddress : "Houston",
        suggestedPrice : 30,
        total : 60
    }
]


module.exports = {
    users:mockusers, 
    history:mockhistory
}