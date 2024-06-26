const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../index')
const expect = chai.expect

chai.use(chaiHttp)

describe('UC-101: Inloggen', () => {
    // TC-101-1: Verplicht veld ontbreekt
    it('TC-101-1 Verplicht veld ontbreekt - email is verplicht', (done) => {
        chai.request(server)
            .post('/api/auth/login')
            .send({ password: 'secret' })
            .end((err, res) => {
                expect(res).to.have.status(400)
                expect(res.body)
                    .to.have.property('message')
                    .eql(
                        'AssertionError [ERR_ASSERTION]: email is required and must be a string.'
                    )
                done()
            })
    })

    // TC-101-2: Niet-valide wachtwoord
    it('TC-101-2 Niet-valide wachtwoord', (done) => {
        chai.request(server)
            .post('/api/auth/login')
            .send({
                emailAdress: 'mvd.vandam@server.b.c.d.nl',
                password: 'wrongpassword'
            })
            .end((err, res) => {
                expect(res).to.have.status(400)
                expect(res.body)
                    .to.have.property('message')
                    .eql('Password invalid')
                done()
            })
    })

    // TC-101-3: Gebruiker bestaat niet
    it('TC-101-3 Gebruiker bestaat niet', (done) => {
        chai.request(server)
            .post('/api/auth/login')
            .send({
                emailAdress: 'nonexistent@example.com',
                password: 'password123'
            })
            .end((err, res) => {
                expect(res).to.have.status(404)
                expect(res.body)
                    .to.have.property('message')
                    .eql('User not found')
                done()
            })
    })

    // TC-101-4: Gebruiker succesvol ingelogd
    it('TC-101-4 Gebruiker succesvol ingelogd', (done) => {
        chai.request(server)
            .post('/api/auth/login')
            .send({
                emailAdress: 'mvd.vandam@server.b.c.d.nl',
                password: 'secret'
            })
            .end((err, res) => {
                expect(res).to.have.status(200)
                expect(res.body)
                    .to.have.property('message')
                    .eql('User logged in')
                done()
            })
    })
})
