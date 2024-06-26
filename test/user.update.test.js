const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../index')
const tracer = require('tracer')

chai.should()
chai.use(chaiHttp)
tracer.setLevel('warn')

const endpointToTest = '/api/user/'

describe('UC-205 Updaten van usergegevens', () => {
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

    describe('TC-205-1 Verplicht veld “emailAddress” ontbreekt', () => {
        it('should return a bad request error message', (done) => {
            chai.request(server)
                .put(`${endpointToTest}${1}`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    firstName: 'New',
                    lastName: 'User',
                    phoneNumber: '0987654321'
                })
                .end((err, res) => {
                    res.should.have.status(400)
                    res.body.should.be.a('object')
                    res.body.should.have
                        .property('message')
                        .eql('Verplicht veld “emailAddress” ontbreekt')
                    done()
                })
        })
    })

    describe('TC-205-2 De gebruiker is niet de eigenaar van de data', () => {
        it('should return a forbidden error message', (done) => {
            chai.request(server)
                .put(`${endpointToTest}${2}`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    firstName: 'New',
                    lastName: 'User',
                    emailAddress: 'newuser@example.com',
                    phoneNumber: '0987654321'
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

    describe('TC-205-3 Niet-valide telefoonnummer', () => {
        it('should return a bad request error message', (done) => {
            chai.request(server)
                .put(`${endpointToTest}${1}`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    firstName: 'Mark',
                    lastName: 'Van Dam',
                    emailAdress: 'mvd.vandam@server.nl',
                    password: 'secret',
                    isActive: 'false',
                    street: 'Lovensdijkstraat',
                    city: 'Breda',
                    phoneNumber: '06 jjj',
                    roles: 'editor,guest'
                })
                .end((err, res) => {
                    res.should.have.status(400)
                    res.body.should.be.a('object')
                    res.body.should.have
                        .property('message')
                        .eql('PhoneNumber must only contain numbers')
                    done()
                })
        })
    })

    describe('TC-205-4 Gebruiker bestaat niet', () => {
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

    describe('TC-205-5 Niet ingelogd', () => {
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

    describe('TC-205-6 Gebruiker succesvol gewijzigd', () => {
        it('should update the user', (done) => {
            chai.request(server)
                .put(`${endpointToTest}${1}`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                    firstName: 'Mark',
                    lastName: 'Van Dam',
                    emailAdress: 'mvd.vandam@server.b.c.d.nl',
                    password: 'secret',
                    isActive: 'false',
                    street: 'Lovensdijkstraat',
                    city: 'Breda',
                    phoneNumber: '06 25897745',
                    roles: 'editor,guest'
                })
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be.a('object')
                    res.body.should.have
                        .property('message')
                        .eql('User updated with id 1.')
                    done()
                })
        })
    })
})
