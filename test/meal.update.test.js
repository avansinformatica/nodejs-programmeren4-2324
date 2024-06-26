const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../index')
const tracer = require('tracer')

chai.should()
chai.use(chaiHttp)
tracer.setLevel('warn')

const endpointToTest = '/api/meal'
const validToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTcxOTQxNjE5MiwiZXhwIjoxNzIwNDUyOTkyfQ.PU5WJQ_dlBcaYMZ7f15qv206xxj9TixPeG0LpfGFGSo'
let mealId = 36 // Variable to store the meal ID for testing

describe('UC-302 Wijzigen van maaltijdsgegevens', () => {
    before((done) => {
        console.log('Before each test')
        done()
    })

    describe('TC-302-1 Verplicht veld ontbreekt', () => {
        it('should return an error message', (done) => {
            chai.request(server)
                .put(`${endpointToTest}/${mealId}`)
                .set('Authorization', `Bearer ${validToken}`)
                .send({
                    isActive: 1,
                    isVega: 0,
                    isVegan: 0,
                    isToTakeHome: 0,
                    dateTime: '2022-06-26',
                    maxAmountOfParticipants: 4,
                    price: 13.25,
                    imageUrl: 'htpass',
                    cookid: 1,
                    createDate: '2022-06-26',
                    updateDate: '2022-06-26',
                    // Missing name field
                    description: 'lekker',
                    allergenes: 'gluten'
                })
                .end((err, res) => {
                    res.should.have.status(400)
                    res.body.should.be.a('object')
                    res.body.should.have
                        .property('message')
                        .eql('Missing required fields')
                    done()
                })
        })
    })

    describe('TC-302-2 Niet ingelogd', () => {
        it('should return an error message', (done) => {
            chai.request(server)
                .put(`${endpointToTest}/${mealId}`)
                .set('Authorization', `Bearer invalid_token`)
                .send({
                    name: 'Spaghetti',
                    price: 14.5,
                    maxAmountOfParticipants: 5
                })
                .end((err, res) => {
                    res.should.have.status(401)
                    res.body.should.be.a('object')
                    res.body.should.have
                        .property('message')
                        .eql('Not authorized!')
                    done()
                })
        })
    })

    describe('TC-302-3 Niet de eigenaar van de data', () => {
        it('should return an error message', (done) => {
            chai.request(server)
                .put(`${endpointToTest}/${mealId}`)
                .set(
                    'Authorization',
                    `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQxLCJpYXQiOjE3MTk0MTc4ODQsImV4cCI6MTcyMDQ1NDY4NH0.TztKIOzdSKwHAc-x806flHpVA01S8R5k7DiBqLlJzGQ`
                ) // Use another user's token
                .send({
                    name: 'Spaghetti',
                    price: 14.5,
                    maxAmountOfParticipants: 5
                })
                .end((err, res) => {
                    res.should.have.status(403)
                    res.body.should.be.a('object')
                    res.body.should.have
                        .property('message')
                        .eql('Je bent niet de eigenaar van de data')
                    done()
                })
        })
    })

    describe('TC-302-4 Maaltijd bestaat niet', () => {
        it('should return an error message', (done) => {
            const nonExistentMealId = 999999 // Assume this ID does not exist
            chai.request(server)
                .put(`${endpointToTest}/${nonExistentMealId}`)
                .set('Authorization', `Bearer ${validToken}`)
                .send({
                    name: 'Spaghetti',
                    price: 14.5,
                    maxAmountOfParticipants: 5
                })
                .end((err, res) => {
                    res.should.have.status(404)
                    res.body.should.be.a('object')
                    res.body.should.have
                        .property('message')
                        .eql('Meal not found')
                    done()
                })
        })
    })

    describe('TC-302-5 Maaltijd succesvol gewijzigd', () => {
        it('should return a success message and updated meal data', (done) => {
            chai.request(server)
                .put(`${endpointToTest}/${mealId}`)
                .set('Authorization', `Bearer ${validToken}`)
                .send({
                    name: 'Spaghetti',
                    price: 14.5,
                    maxAmountOfParticipants: 5,
                    dateTime: '2022-07-26',
                    description: 'Lekker Spaghetti',
                    allergenes: 'gluten, soja'
                })
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be.a('object')
                    res.body.should.have
                        .property('message')
                        .eql('Meal updated with id ' + mealId)
                    done()
                })
        })
    })
})
