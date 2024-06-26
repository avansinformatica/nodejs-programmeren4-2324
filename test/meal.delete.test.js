const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../index')
const tracer = require('tracer')

chai.should()
chai.use(chaiHttp)
tracer.setLevel('warn')

const endpointToTest = '/api/meal'

describe('UC-305 Verwijderen van maaltijd', () => {
    const token =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTcxOTQyNjY3NywiZXhwIjoxNzIwNDYzNDc3fQ.aCbAaBgWkwJNKawxpubZVrmJTh3oXj0tyE_fPBjWan0'

    beforeEach((done) => {
        console.log('Before each test')
        done()
    })

    describe('TC-305-1 Niet ingelogd', () => {
        it('should return an error message', (done) => {
            chai.request(server)
                .delete(`${endpointToTest}/1`)
                .set('Authorization', `Bearer invalid_token`)
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

    describe('TC-305-2 Niet de eigenaar van de data', () => {
        it('should return a forbidden error message', (done) => {
            chai.request(server)
                .delete(`${endpointToTest}/2`) // Assuming meal ID 2 belongs to another user
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

    describe('TC-305-3 Maaltijd bestaat niet', () => {
        it('should return a error message', (done) => {
            chai.request(server)
                .delete(`${endpointToTest}/999`) // Assuming meal ID 999 does not exist
                .set('Authorization', `Bearer ${token}`)
                .end((err, res) => {
                    res.should.have.status(404)
                    res.body.should.be.a('object')
                    res.body.should.have
                        .property('message')
                        .eql('Meal not found')
                    done()
                })
        })
    })

    describe('TC-305-4 Maaltijd succesvol verwijderd', () => {
        it('should delete the meal successfully', (done) => {
            // First create a meal to ensure there is a meal to delete
            chai.request(server)
                .delete(endpointToTest + '/1')
                .set('Authorization', 'Bearer ' + token)
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be.an
                        .an('object')
                        .that.has.all.keys('status', 'message')
                    res.body.status.should.be.a('number')
                    res.body.message.should.equal('Meal deleted with id 1.')
                    done()
                })
        })
    })
})
