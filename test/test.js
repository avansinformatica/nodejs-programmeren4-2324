// test/user.routes.test.js
const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();

chai.use(chaiHttp);

describe('User Routes', () => {
    describe('GET /api/users', () => {
        it('should GET all the users', (done) => {
            chai.request(server)
                .get('/api/users')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    done();
                });
        });
    });

    describe('POST /api/users', () => {
        it('should POST a user', (done) => {
            let user = {
                firstName: "John",
                lastName: "Doe",
                emailAdress: "john.doe@example.com"
            }
            chai.request(server)
                .post('/api/users')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('firstName');
                    res.body.should.have.property('lastName');
                    res.body.should.have.property('emailAdress');
                    done();
                });
        });
    });

    describe('GET /api/users/:userId', () => {
        it('should GET a user by the given id', (done) => {
            let userId = 1; // Replace with an actual user id
            chai.request(server)
                .get('/api/users/' + userId)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('firstName');
                    res.body.should.have.property('lastName');
                    res.body.should.have.property('emailAdress');
                    done();
                });
        });
    });
});