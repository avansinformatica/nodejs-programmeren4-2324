const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../index')

chai.should()
chai.use(chaiHttp)

const endpointToTest = '/api/users'

describe('UC201 Registreren als nieuwe user', () => {
    it.skip('TC-201-1 Verplicht veld ontbreekt', (done) => {
        //
        // Hier schrijf je jouw testcase.
        //
        done()
    })

    it.skip('TC-201-2 Niet-valide email adres', (done) => {
        done()
    })

    it.skip('TC-201-3 Niet-valide password', (done) => {
        //
        // Hier schrijf je jouw testcase.
        //
        done()
    })

    it.skip('TC-201-4 Gebruiker bestaat al', (done) => {
        //
        // Hier schrijf je jouw testcase.
        //
        done()
    })

    it('TC-201-5 Gebruiker succesvol geregistreerd', (done) => {
        chai.request(server)
            .post(endpointToTest)
            .send({
                firstName: 'Voornaam',
                lastName: 'Achternaam',
                emailAdress: 'v.a@server.nl'
            })
            .end((err, res) => {
                res.should.have.status(200)
                res.body.should.be.a('object')

                res.body.should.have.property('data').that.is.a('object')
                res.body.should.have.property('message').that.is.a('string')

                const data = res.body.data
                data.should.have.property('firstName').equals('Voornaam')
                data.should.have.property('lastName').equals('Achternaam')
                data.should.have.property('emailAdress')
                data.should.have.property('id').that.is.a('number')

                done()
            })
    })
})
