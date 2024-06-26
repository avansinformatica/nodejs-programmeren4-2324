const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../index')

chai.should()
chai.use(chaiHttp)

let token = ''

describe('UC202 Opvragen van Users', () => {
    const endpointToTest = '/api/users'
    let agent

    beforeEach((done) => {
        agent = chai.request.agent(server)
        // Simulate login
        agent
            .post('/api/auth/login')
            .send({
                emailAdress: 'm.vandullemen@server.nl',
                password: 'secret'
            })
            .end((err, res) => {
                res.should.have.status(200)
                token = res.body.data.token
                done()
            })
    })

    it('TC-202-1 Opvragen van alle users', (done) => {
        agent
            .get(endpointToTest)
            .set('Authorization', `Bearer ${token}`) // Set the Authorization header
            .end((err, res) => {
                chai.expect(res).to.have.status(200)
                chai.expect(res).not.to.have.status(400)

                done()
            })
    })
})

describe('UC203 Opvragen van een gebruikersprofiel', () => {
    const endpointToTest = '/api/user/profile'
    let agent

    beforeEach((done) => {
        agent = chai.request.agent(server)
        // Simulate login
        agent
            .post('/api/auth/login')
            .send({
                emailAdress: 'm.vandullemen@server.nl',
                password: 'secret'
            })
            .end((err, res) => {
                res.should.have.status(200)
                token = res.body.data.token
                done()
            })
    })

    it('TC-203-1 Opvragen van een gebruikersprofiel', (done) => {
        agent
            .get(endpointToTest)
            .set('Authorization', `Bearer ${token}`) // Set the Authorization header
            .end((err, res) => {
                chai.expect(res).to.have.status(200)
                chai.expect(res).not.to.have.status(400)
                chai.expect(res.body).to.be.a('object')
                done()
            })
    })
})

describe('UC205-Verwijderen van een gebruiker', () => {
    const endpointToTest = '/api/user/delete'
    let agent

    beforeEach((done) => {
        agent = chai.request.agent(server)
        // Simulate login
        agent
            .post('/api/auth/login')
            .send({
                emailAdress: 'm.vandullemen@server.nl',
                password: 'secret'
            })
            .end((err, res) => {
                res.should.have.status(200)
                token = res.body.data.token
                done()
            })
    })
    it('TC-205-1 Verwijderen van een gebruiker', (done) => {
        agent
            .delete(endpointToTest)
            .set('Authorization', `Bearer ${token}`)
            .send() // Set the Authorization header
            .end((err, res) => {
                chai.expect(res).to.have.status(200)
                chai.expect(res).not.to.have.status(400)
                chai.expect(res.body).to.be.a('object')
                done()
            })
    })
})
