const mockusers = [
    {
        uid:1,
        username:"testing",
        password:'$2b$10$XOZ93p5Rn3Xq2eJU2dSGReCycnECRIsFk/eSDlKa3MEG1PHScVESe' //this is 'testing' but hashed with 10 cost factor
    }
]

const mockhistory = [
    {
        gallons_requested : 50,
        delivery_date : "1/21/22",
        address : "University of Houston",
        total_price : 400,
        fee : 20
    },
    {
        gallons_requested : 15,
        delivery_date : "4/30/25",
        address  : "Houston",
        total_price : 100,
        fee : 5
    }
]

const mockProfile = [
    {
        fullName: "Timmy Turner",
        address1: "1111 Bottom Drive",
        address2: "Apt 2",
        city: "Houston",
        state: "TX",
        zipcode: 34345
    }
]

module.exports = {
    users:mockusers, 
    history:mockhistory,
    profile:mockProfile
}