const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../index')
const tracer = require('tracer')

chai.should()
chai.use(chaiHttp)
tracer.setLevel('warn')

const endpointToTest = '/api/user/'

describe('UC-204 Opvragen van usergegevens bij ID', () => {
    const token =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTcxNTcwMTY0MSwiZXhwIjoxNzE2NzM4NDQxfQ.BxtXJ_NBxBuFWYN5xb1mkW2iWR35RPg4U1HIHm-mMPA'

    /**
     * Voorbeeld van een beforeEach functie.
     * Hiermee kun je code hergebruiken of initialiseren.
     */
    beforeEach((done) => {
        console.log('Before each test')
        done()
    })

    /**
     * Hier starten de testcases
     */

    describe('TC-204-1 Ongeldig token', () => {
        it('should return an error message', (done) => {
            chai.request(server)
                .get(`${endpointToTest}1`)
                .set(
                    'Authorization',
                    'Bearer eyJ1c2VySWQiOjEsImlhdCI6MTcxNTcwMTY0MSwiZXhwIjoxNzE2NzM4NDQxfQ'
                )
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

    describe('TC-204-2 Gebruiker-ID bestaat niet', () => {
        it('should return a not found error message', (done) => {
            chai.request(server)
                .get(`${endpointToTest}9999999999`)
                .set('Authorization', `Bearer ${token}`)
                .end((err, res) => {
                    res.should.have.status(404)
                    res.body.should.be.a('object')
                    res.body.should.have
                        .property('message')
                        .eql('Gebruiker-ID bestaat niet')
                    done()
                })
        })
    })

    describe('TC-204-3 Gebruiker-ID bestaat', () => {
        it('should return a success message and user data', (done) => {
            chai.request(server)
                .get(`${endpointToTest}1`)
                .set('Authorization', `Bearer ${token}`)
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be.a('object')
                    res.body.should.have
                        .property('message')
                        .eql('Found 1 user.')
                    res.body.should.have.property('data').which.is.an('array')
                    res.body.data[0].should.have.property('id').eql(1)
                    res.body.data[0].should.have.property('firstName')
                    res.body.data[0].should.have.property('lastName')
                    res.body.data[0].should.have.property('isActive')
                    done()
                })
        })
    })
})
