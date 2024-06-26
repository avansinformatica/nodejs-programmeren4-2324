const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../index')
const tracer = require('tracer')

describe('UC301 Maaltijd aanmaken', () => {
    const endpointToTest = '/meal/create'
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

    it('TC-301-1 Maaltijd aanmaken zonder naam', (done) => {
        agent
            .post(endpointToTest)
            .set('Authorization', `Bearer ${token}`) // Set the Authorization header
            .send({
                description: 'Pizza met tomatensaus en kaas',
                price: 10.0,
                cookId: 1,
                imageURL:
                    'https://www.pizzahut.be/medias/sys_master/root/hf3/hf3/9111160323102/cheezy-crust-pizza.png',
                datatime: '2021-12-31 23:59:59'
            })
            .end((err, res) => {
                chai.expect(res).to.have.status(400)
                chai.expect(res).not.to.have.status(200)

                done()
            })
    })
    it('TC-301-2 Maaltijd aanmaken zonder beschrijving', (done) => {
        agent
            .post(endpointToTest)
            .set('Authorization', `Bearer ${token}`) // Set the Authorization header
            .send({
                name: 'Pizza',
                price: 10.0,
                cookId: 1,
                imageURL:
                    'https://www.pizzahut.be/medias/sys_master/root/hf3/hf3/9111160323102/cheezy-crust-pizza.png',
                datatime: '2021-12-31 23:59:59'
            })
            .end((err, res) => {
                chai.expect(res).to.have.status(400)
                chai.expect(res).not.to.have.status(200)

                done()
            })
    })
    it('TC-301-3 Maaltijd aanmaken zonder prijs', (done) => {
        agent
            .post(endpointToTest)
            .set('Authorization', `Bearer ${token}`) // Set the Authorization header
            .send({
                name: 'Pizza',
                description: 'Pizza met tomatensaus en kaas',
                cookId: 1,
                imageURL:
                    'https://www.pizzahut.be/medias/sys_master/root/hf3/hf3/9111160323102/cheezy-crust-pizza.png',
                datatime: '2021-12-31 23:59:59'
            })
            .end((err, res) => {
                chai.expect(res).to.have.status(400)
                chai.expect(res).not.to.have.status(200)

                done()
            })
    })
    it('TC-301-4 Maaltijd aanmaken zonder cookId', (done) => {
        agent
            .post(endpointToTest)
            .set('Authorization', `Bearer ${token}`) // Set the Authorization header
            .send({
                name: 'Pizza',
                description: 'Pizza met tomatensaus en kaas',
                price: 10.0,
                imageURL:
                    'https://www.pizzahut.be/medias/sys_master/root/hf3/hf3/9111160323102/cheezy-crust-pizza.png',
                datatime: '2021-12-31 23:59:59'
            })
            .end((err, res) => {
                chai.expect(res).to.have.status(400)
                chai.expect(res).not.to.have.status(200)

                done()
            })
    })
    it('TC-301-5 Maaltijd aanmaken zonder imageURL', (done) => {
        agent
            .post(endpointToTest)
            .set('Authorization', `Bearer ${token}`) // Set the Authorization header
            .send({
                name: 'Pizza',
                description: 'Pizza met tomatensaus en kaas',
                price: 10.0,
                cookId: 1,
                datatime: '2021-12-31 23:59:59'
            })
            .end((err, res) => {
                chai.expect(res).to.have.status(400)
                chai.expect(res).not.to.have.status(200)

                done()
            })
    })
    it('TC-301-6 Maaltijd aanmaken met ongeldige imageURL', (done) => {
        agent
            .post(endpointToTest)
            .set('Authorization', `Bearer ${token}`) // Set the Authorization header
            .send({
                name: 'Pizza',
                description: 'Pizza met tomatensaus en kaas',
                price: 10.0,
                cookId: 1,
                imageURL:
                    'https://www.pizzahut.be/medias/sys_master/root/hf3/hf3/9111160323102/cheezy-crust-pizza',
                datatime: '2021-12-31 23:59:59'
            })
            .end((err, res) => {
                chai.expect(res).to.have.status(400)
                chai.expect(res).not.to.have.status(200)

                done()
            })
    })
    it('TC-301-7 Maaltijd aanmaken zonder datetime', (done) => {
        agent
            .post(endpointToTest)
            .set('Authorization', `Bearer ${token}`) // Set the Authorization header
            .send({
                name: 'Pizza',
                description: 'Pizza met tomatensaus en kaas',
                price: 10.0,
                cookId: 1,
                imageURL:
                    'https://www.pizzahut.be/medias/sys_master/root/hf3/hf3/9111160323102/cheezy-crust-pizza.png'
            })
            .end((err, res) => {
                chai.expect(res).to.have.status(400)
                chai.expect(res).not.to.have.status(200)

                done()
            })
    })
})
describe('UC302 Maaltijd wijzigen', () => {
    const endpointToTest = '/meal/update'
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
    it('TC-302-1 Maaltijd wijzigen zonder naam', (done) => {
        agent
            .put(endpointToTest)
            .set('Authorization', `Bearer ${token}`) // Set the Authorization header
            .send({
                description: 'Pizza met tomatensaus en kaas',
                price: 10.0,
                cookId: 1,
                imageURL:
                    'https://www.pizzahut.be/medias/sys_master/root/hf3/hf3/9111160323102/cheezy-crust-pizza.png',
                datatime: '2021-12-31 23:59:59'
            })
            .end((err, res) => {
                chai.expect(res).to.have.status(400)
                chai.expect(res).not.to.have.status(200)

                done()
            })
    })
    it('TC-302-2 Maaltijd wijzigen zonder beschrijving', (done) => {
        agent
            .put(endpointToTest)
            .set('Authorization', `Bearer ${token}`) // Set the Authorization header
            .send({
                name: 'Pizza',
                price: 10.0,
                cookId: 1,
                imageURL:
                    'https://www.pizzahut.be/medias/sys_master/root/hf3/hf3/9111160323102/cheezy-crust-pizza.png',
                datatime: '2021-12-31 23:59:59'
            })
            .end((err, res) => {
                chai.expect(res).to.have.status(400)
                chai.expect(res).not.to.have.status(200)

                done()
            })
    })
    it('TC-302-3 Maaltijd wijzigen zonder prijs', (done) => {
        agent
            .put(endpointToTest)
            .set('Authorization', `Bearer ${token}`) // Set the Authorization header
            .send({
                name: 'Pizza',
                description: 'Pizza met tomatensaus en kaas',
                cookId: 1,
                imageURL:
                    'https://www.pizzahut.be/medias/sys_master/root/hf3/hf3/9111160323102/cheezy-crust-pizza.png',
                datatime: '2021-12-31 23:59:59'
            })
            .end((err, res) => {
                chai.expect(res).to.have.status(400)
                chai.expect(res).not.to.have.status(200)

                done()
            })
    })
    it('TC-302-4 Maaltijd wijzigen zonder cookId', (done) => {
        agent
            .put(endpointToTest)
            .set('Authorization', `Bearer ${token}`) // Set the Authorization header
            .send({
                name: 'Pizza',
                description: 'Pizza met tomatensaus en kaas',
                price: 10.0,
                imageURL:
                    'https://www.pizzahut.be/medias/sys_master/root/hf3/hf3/9111160323102/cheezy-crust-pizza.png',
                datatime: '2021-12-31 23:59:59'
            })
            .end((err, res) => {
                chai.expect(res).to.have.status(400)
                chai.expect(res).not.to.have.status(200)

                done()
            })
    })
    it('TC-302-5 Maaltijd wijzigen zonder imageURL', (done) => {
        agent
            .put(endpointToTest)
            .set('Authorization', `Bearer ${token}`) // Set the Authorization header
            .send({
                name: 'Pizza',
                description: 'Pizza met tomatensaus en kaas',
                price: 10.0,
                cookId: 1,
                datatime: '2021-12-31 23:59:59'
            })
            .end((err, res) => {
                chai.expect(res).to.have.status(400)
                chai.expect(res).not.to.have.status(200)

                done()
            })
    })
    it('TC-302-6 Maaltijd wijzigen met ongeldige imageURL', (done) => {
        agent
            .put(endpointToTest)
            .set('Authorization', `Bearer ${token}`) // Set the Authorization header
            .send({
                name: 'Pizza',
                description: 'Pizza met tomatensaus en kaas',
                price: 10.0,
                cookId: 1,
                imageURL:
                    'https://www.pizzahut.be/medias/sys_master/root/hf3/hf3/9111160323102/cheezy-crust-pizza',
                datatime: '2021-12-31 23:59:59'
            })
            .end((err, res) => {
                chai.expect(res).to.have.status(400)
                chai.expect(res).not.to.have.status(200)

                done()
            })
    })
    it('TC-302-7 Maaltijd wijzigen zonder datetime', (done) => {
        agent
            .put(endpointToTest)
            .set('Authorization', `Bearer ${token}`) // Set the Authorization header
            .send({
                name: 'Pizza',
                description: 'Pizza met tomatensaus en kaas',
                price: 10.0,
                cookId: 1,
                imageURL:
                    'https://www.pizzahut.be/medias/sys_master/root/hf3/hf3/9111160323102/cheezy-crust-pizza.png'
            })
            .end((err, res) => {
                chai.expect(res).to.have.status(400)
                chai.expect(res).not.to.have.status(200)

                done()
            })
    })
})
describe('UC303 Maaltijd verwijderen', () => {
    const endpointToTest = '/meal/delete'
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
    it('TC-303-1 Maaltijd verwijderen zonder mealId', (done) => {
        agent
            .delete(endpointToTest)
            .set('Authorization', `Bearer ${token}`) // Set the Authorization header
            .send()
            .end((err, res) => {
                chai.expect(res).to.have.status(404)
                chai.expect(res).not.to.have.status(200)

                done()
            })
    })
    it('TC-303-2 Maaltijd verwijderen met ongeldig mealId', (done) => {
        agent
            .delete(endpointToTest)
            .set('Authorization', `Bearer ${token}`) // Set the Authorization header
            .send({
                mealId: 'invalid'
            })
            .end((err, res) => {
                chai.expect(res).to.have.status(404)
                chai.expect(res).not.to.have.status(200)

                done()
            })
    })
    it('TC-303-3 Maaltijd verwijderen met onbekend mealId', (done) => {
        agent
            .delete(endpointToTest)
            .set('Authorization', `Bearer ${token}`) // Set the Authorization header
            .send({
                mealId: 999999
            })
            .end((err, res) => {
                chai.expect(res).to.have.status(404)
                chai.expect(res).not.to.have.status(200)

                done()
            })
    })
})
describe('UC304 Maaltijd zoeken', () => {
    const endpointToTest = '/meal/search'
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

    it('TC-301 Maaltijd zoeken met bekende naam', (done) => {
        agent
            .get(endpointToTest)
            .set('Authorization', `Bearer ${token}`) // Set the Authorization header
            .send({
                name: 'Pizza'
            })
            .end((err, res) => {
                chai.expect(res).to.have.status(200)
                chai.expect(res).not.to.have.status(400)

                done()
            })
    })
})
describe('UC305 Maaltijd tonen', () => {
    const endpointToTest = '/meal'
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

    it('TC-305-1 Maaltijd tonen met bekend mealId', (done) => {
        agent
            .get(endpointToTest)
            .set('Authorization', `Bearer ${token}`) // Set the Authorization header
            .send({
                mealId: 1
            })
            .end((err, res) => {
                chai.expect(res).to.have.status(200)
                chai.expect(res).not.to.have.status(400)

                done()
            })
    })
})
