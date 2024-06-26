const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../index')
const tracer = require('tracer')

chai.should()
chai.use(chaiHttp)
tracer.setLevel('warn')

const endpointToTest = '/api/user/'

describe('UC-206 Verwijderen van user', () => {
    const token =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTcxNTcxMzk3NiwiZXhwIjoxNzE2NzUwNzc2fQ.w0Vk1goKVpCB-Gt8M5afnvrQPTeZEy6t4xCzmr7BkGg'
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

    describe('TC-206-1 Gebruiker bestaat niet', () => {
        it('should return a error message', (done) => {
            chai.request(server)
                .put(`${endpointToTest}${999}`)
                .set('Authorization', `Bearer ${token}`)
                .end((err, res) => {
                    res.should.have.status(404)
                    res.body.should.be.a('object')
                    res.body.should.have
                        .property('message')
                        .eql('User not found')
                    done()
                })
        })
    })

    describe('TC-206-2 Gebruiker is niet ingelogd', () => {
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

    describe('TC-206-3 De gebruiker is niet de eigenaar van de data', () => {
        it('should return a forbidden error message', (done) => {
            chai.request(server)
                .put(`${endpointToTest}${2}`)
                .set('Authorization', `Bearer ${token}`)
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

    describe('TC-206-4 Gebruiker succesvol verwijderd', () => {
        it('should delete the user', (done) => {
            chai.request(server)
                .delete(`${endpointToTest}${61}`)
                .set(
                    'Authorization',
                    `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjYxLCJpYXQiOjE3MTU3MTkyMTAsImV4cCI6MTcxNjc1NjAxMH0.SckOigMtgBBRwosm1n9qgtz6zKRxcB1CCTPFhUDy3Js`
                )
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be.a('object')
                    res.body.should.have
                        .property('message')
                        .eql('User deleted with id 61.')
                    done()
                })
        })
    })
})
