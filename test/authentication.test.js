const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../index')
const tracer = require('tracer')

describe('UC101 Login', () => {
    const endpointToTest = '/api/auth/login'
    beforeEach((done) => {
        console.log('Before each test')
        done()
    })
    it('TC-101-1 Verplicht veld ontbreekt', (done) => {
        chai.request(server)
            .post(endpointToTest)
            .send({
                // emailAdress: 'v.a@server', ontbreekt
                password: 'secret'
            })
            .end((err, res) => {
                chai.expect(res).to.have.status(409)
                chai.expect(res).not.to.have.status(200)
                chai.expect(res.body).to.be.a('object')
                chai.expect(res.body).to.have.property('status').equals(409)
                chai.expect(res.body)
                    .to.have.property('message')
                    .equals(
                        'AssertionError [ERR_ASSERTION]: email must be a string.'
                    )
                chai
                    .expect(res.body)
                    .to.have.property('data')
                    .that.is.a('object').that.is.empty
                done()
            })
    })
    it('TC-101-2 Niet-valide email adres', (done) => {
        chai.request(server)
            .post(endpointToTest)
            .send({
                emailAdress: 'v.a@server',
                password: 'secret'
            })
            .end((err, res) => {
                chai.expect(res).to.have.status(400)
                chai.expect(res).not.to.have.status(200)
                chai.expect(res.body).to.be.a('object')
                chai.expect(res.body).to.have.property('status').equals(400)
                chai.expect(res.body)
                    .to.have.property('message')
                    .equals(
                        'User not found or the combination of email and password invalid'
                    )
                chai
                    .expect(res.body)
                    .to.have.property('data')
                    .that.is.a('object').that.is.empty
                done()
            })
    })
    it('TC-101-3 Niet-valide wachtwoord', (done) => {
        chai.request(server)
            .post(endpointToTest)
            .send({
                emailAdress: 'Joep.Snels@kpnmail.nl',
                password: 'notsecret'
            })
            .end((err, res) => {
                chai.expect(res).to.have.status(400)
                chai.expect(res).not.to.have.status(200)
                chai.expect(res.body).to.be.a('object')
                chai.expect(res.body).to.have.property('status').equals(400)
                chai.expect(res.body)
                    .to.have.property('message')
                    .equals(
                        'User not found or the combination of email and password invalid'
                    )
                chai
                    .expect(res.body)
                    .to.have.property('data')
                    .that.is.a('object').that.is.empty
                done()
            })
    })
    it('TC-101-4 Succesvolle login', (done) => {
        chai.request(server)
            .post(endpointToTest)
            .send({
                emailAdress: 'Joep.Snels@kpnmail.nl',
                password: 'secret'
            })
            .end((err, res) => {
                chai.expect(res).to.have.status(200)
                chai.expect(res.body).to.be.a('object')
                chai.expect(res.body).to.have.property('status').equals(200)
                chai.expect(res.body)
                    .to.have.property('message')
                    .equals('User logged in')
                chai.expect(res.body)
                    .to.have.property('data')
                    .that.is.a('object')
                done()
            })
    })
})
describe('UC201 Registreren', () => {
    const endpointToTest = '/api/auth/register'
    beforeEach((done) => {
        console.log('Before each test')
        done()
    })
    it('TC-202-1 Verplicht veld ontbreekt', (done) => {
        chai.request(server)
            .post(endpointToTest)
            .send({
                // emailAdress: 'v.a@server', ontbreekt
                password: 'secret',
                firstName: 'Joep',
                lastName: 'Snels',
                phoneNumber: '0612345678',
                street: 'Kerkstraat 1',
                city: 'Amsterdam'
            })
            .end((err, res) => {
                chai.expect(res).to.have.status(400)
                chai.expect(res).not.to.have.status(200)
                chai.expect(res.body).to.be.a('object')
                chai.expect(res.body).to.have.property('status').equals(400)
                chai.expect(res.body).to.have.property('message')
                chai
                    .expect(res.body)
                    .to.have.property('data')
                    .that.is.a('object').that.is.empty
                done()
            })
    })
    it('TC-202-2 Niet-valide email adres', (done) => {
        chai.request(server)
            .post(endpointToTest)
            .send({
                emailAdress: 'v.a@server',
                password: 'secret',
                firstName: 'Joep',
                lastName: 'Snels',
                phoneNumber: '0612345678',
                street: 'Kerkstraat 1',
                city: 'Amsterdam'
            })
            .end((err, res) => {
                chai.expect(res).to.have.status(400)
                chai.expect(res).not.to.have.status(200)
                chai.expect(res.body).to.be.a('object')
                chai.expect(res.body).to.have.property('status').equals(400)
                chai.expect(res.body).to.have.property('message')
                chai
                    .expect(res.body)
                    .to.have.property('data')
                    .that.is.a('object').that.is.empty
                done()
            })
    })
    it('TC-202-3 Niet-valide telefoonnummer', (done) => {
        chai.request(server)
            .post(endpointToTest)
            .send({
                emailAdress: 'Joep.Snels@kpnmail.nl',
                password: 'secret',
                firstName: 'Joep',
                lastName: 'Snels',
                phoneNumber: '06123456789',
                street: 'Kerkstraat',
                city: 'Amsterdam'
            })
            .end((err, res) => {
                chai.expect(res).to.have.status(400)
                chai.expect(res).not.to.have.status(200)
                chai.expect(res.body).to.be.a('object')
                chai.expect(res.body).to.have.property('status').equals(400)
                chai.expect(res.body).to.have.property('message')

                chai
                    .expect(res.body)
                    .to.have.property('data')
                    .that.is.a('object').that.is.empty
                done()
            })
    })
    it('TC-202-4 Succesvol registreren', (done) => {
        chai.request(server)
            .post(endpointToTest)
            .send({
                emailAdress: 'Hans.Klok70@gmail.com',
                password: 'secret',
                firstName: 'Hans',
                lastName: 'Klok',
                phoneNumber: '0612345674',
                street: 'Kerkstraat',
                city: 'Amsterdam'
            })
            .end((err, res) => {
                chai.expect(res).to.have.status(201)
                chai.expect(res.body).to.be.a('object')
                chai.expect(res.body).to.have.property('status').equals(201)
                chai.expect(res.body)
                    .to.have.property('message')
                    .equals('User registered')
                chai.expect(res.body)
                    .to.have.property('data')
                    .that.is.a('object')
                done()
            })
    })
})
