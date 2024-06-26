const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../index')
const tracer = require('tracer')

chai.should()
chai.use(chaiHttp)
tracer.setLevel('warn')

const endpointToTest = '/api/meal'

describe('UC-301 Toevoegen', () => {
    const token =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQxLCJpYXQiOjE3MTkzOTcyNjYsImV4cCI6MTcyMDQzNDA2Nn0.Zszd38stpb_TRLmJG0HKUxSxbWIEFEy-9jAva_4mZZs'
    beforeEach((done) => {
        console.log('Before each test')
        done()
    })

    describe('TC-301-1 Verplicht veld ontbreekt', () => {
        it('should return an error message', (done) => {
            chai.request(server)
                .post(`${endpointToTest}`)
                .set('Authorization', `Bearer ${token}`)
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
                    // name: 'Pasta',
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

    describe('TC-301-2 Niet ingelogd', () => {
        it('should return an error message', (done) => {
            chai.request(server)
                .post(`${endpointToTest}`)
                .set('Authorization', `Bearer ertyuioghjkl;`)
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
                    name: 'Pasta',
                    description: 'lekker',
                    allergenes: 'gluten'
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

    describe('TC-301-3 Maaltijd succesvol toegevoegd', () => {
        it('should return a success message and meal data', (done) => {
            chai.request(server)
                .post(`${endpointToTest}`)
                .set('Authorization', `Bearer ${token}`)
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
                    name: 'Pasta',
                    description: 'lekker',
                    allergenes: 'gluten'
                })
                .end((err, res) => {
                    res.should.have.status(201)
                    res.body.should.be.a('object')
                    res.body.should.have
                        .property('message')
                        .eql('Meal created successfully')
                    done()
                })
        })
    })
})
