const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../index')
const tracer = require('tracer')

chai.should()
chai.use(chaiHttp)
tracer.setLevel('warn')

const endpointToTest = '/api/meal/'

describe('UC-304 Opvragen van maaltijd bij ID', () => {
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
    describe('TC-304-1 Maaltijd bestaat niet', () => {
        it('should return a not found error message', (done) => {
            chai.request(server)
                .get(`${endpointToTest}9999999999`)
                .end((err, res) => {
                    res.should.have.status(404)
                    res.body.should.be.a('object')
                    res.body.should.have
                        .property('message')
                        .eql('meal bestaat niet')
                    done()
                })
        })
    })

    describe('TC-304-2 Details van maaltijd geretourneerd', () => {
        it('should return a success message and meal data', (done) => {
            chai.request(server)
                .get(`${endpointToTest}1`)
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be.a('object')
                    res.body.should.have
                        .property('message')
                        .eql('Found 1 meal.')
                    res.body.should.have.property('data').which.is.an('array')
                    res.body.data[0].should.have.property('id').eql(1)
                    res.body.data[0].should.have.property('isActive')
                    res.body.data[0].should.have.property('isVega')
                    res.body.data[0].should.have.property('isVegan')
                    res.body.data[0].should.have.property('isToTakeHome')
                    res.body.data[0].should.have.property('dateTime')
                    res.body.data[0].should.have.property(
                        'maxAmountOfParticipants'
                    )
                    res.body.data[0].should.have.property('price')
                    res.body.data[0].should.have.property('imageUrl')
                    res.body.data[0].should.have.property('cookId')
                    res.body.data[0].should.have.property('createDate')
                    res.body.data[0].should.have.property('updateDate')
                    res.body.data[0].should.have.property('updateDate')
                    res.body.data[0].should.have.property('name')
                    res.body.data[0].should.have.property('description')
                    res.body.data[0].should.have.property('allergenes')
                    done()
                })
        })
    })
})
