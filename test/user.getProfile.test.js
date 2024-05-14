const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../index')
const tracer = require('tracer')

chai.should()
chai.use(chaiHttp)
tracer.setLevel('warn')

const endpointToTest = '/api/user/profile'

describe('UC-203 Opvragen van gebruikersprofiel', () => {
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

    describe('TC-203-1 Ongeldig token', () => {
        it('should return an error message', (done) => {
            chai.request(server)
                .get(`${endpointToTest}`)
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

        it('should return an error message for an expired token', (done) => {
            chai.request(server)
                .get(`${endpointToTest}`)
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

    describe('TC-203-2 Gebruiker is ingelogd met geldig token', () => {
        it('should return a success message and user data', (done) => {
            chai.request(server)
                .get(`${endpointToTest}`)
                .set('Authorization', `Bearer ${token}`)
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be.a('object')
                    res.body.should.have
                        .property('message')
                        .eql('Found 1 user.')
                    done()
                })
        })
    })
})
