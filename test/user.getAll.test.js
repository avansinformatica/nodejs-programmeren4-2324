const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../index')
const tracer = require('tracer')

chai.should()
chai.use(chaiHttp)
tracer.setLevel('warn')

const endpointToTest = '/api/user'

describe('UC-202 Opvragen van overzicht van users', () => {
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

    it('TC-202-1 Toon alle gebruikers (minimaal 2)', (done) => {
        chai.request(server)
            .get(endpointToTest)
            .end((err, res) => {
                res.should.have.status(200)
                res.body.should.be.a('object')
                res.body.should.have.property('message').eql('Users found')
                res.body.should.have.property('data').with.lengthOf.at.least(2)
                done()
            })
    })

    it('TC-202-2 Toon gebruikers met zoekterm op niet-bestaande velden', (done) => {
        chai.request(server)
            .get(
                `${endpointToTest}?firstName=Tim&lastName=Van Tuinen&isActive=0`
            )
            .end((err, res) => {
                res.should.have.status(200)
                res.body.should.be.a('object')
                res.body.should.have.property('message').eql('No users found')
                res.body.should.have.property('data').with.lengthOf(0)
                done()
            })
    })

    it('TC-202-3 Toon gebruikers met gebruik van de zoekterm op het veld `isActive`=false', (done) => {
        chai.request(server)
            .get(
                `${endpointToTest}?firstName=firstName&lastName=lastName&isActive=0`
            )
            .end((err, res) => {
                res.should.have.status(200)
                res.body.should.be.a('object')
                res.body.should.have.property('message').eql('Users found')
                res.body.should.have.property('data').with.lengthOf.at.least(1)
                done()
            })
    })

    it('TC-202-4 Toon gebruikers met gebruik van de zoekterm op het veld `isActive`=true', (done) => {
        chai.request(server)
            .get(
                `${endpointToTest}?firstName=firstName&lastName=lastName&isActive=1`
            )
            .end((err, res) => {
                res.should.have.status(200)
                res.body.should.be.a('object')
                res.body.should.have.property('message').eql('Users found')
                res.body.should.have.property('data').with.lengthOf.at.least(1)
                done()
            })
    })

    it('TC-202-5 Toon gebruikers met zoektermen op bestaande velden (maximaal 2 velden filteren)', (done) => {
        chai.request(server)
            .get(`${endpointToTest}?firstName=Mark&lastName=Van Dam&isActive=1`)
            .end((err, res) => {
                res.should.have.status(200)
                res.body.should.be.a('object')
                res.body.should.have.property('message').eql('Users found')
                res.body.should.have.property('data').with.lengthOf.at.least(1)
                done()
            })
    })
})
