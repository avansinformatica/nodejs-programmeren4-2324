const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../index')
const tracer = require('tracer')

chai.should()
chai.use(chaiHttp)
tracer.setLevel('warn')

const endpointToTest = '/api/user'

describe('UC201 Registreren als nieuwe user', () => {
    /**
     * Voorbeeld van een beforeEach functie.
     * Hiermee kun je code hergebruiken of initialiseren.
     */
    beforeEach((done) => {
        const database = require("../src/dao/inmem-db");

        database._data = [
            {
                id: 0,
                firstName: 'Existing',
                lastName: 'User',
                emailAdress: 'existing@server.nl',
            },
        ];
        database._index = 1;
        done()
    })

    /**
     * Hier starten de testcases
     */
    it('TC-201-1 Verplicht veld ontbreekt', (done) => {
        chai.request(server)
            .post(endpointToTest)
            .send({
                // firstName: 'Voornaam', ontbreekt
                lastName: 'Achternaam',
                emailAdress: 'v.a@server.nl'
            })
            .end((err, res) => {
                /**
                 * Voorbeeld uitwerking met chai.expect
                 */
                chai.expect(res).to.have.status(400)
                chai.expect(res).not.to.have.status(200)
                chai.expect(res.body).to.be.a('object')
                chai.expect(res.body).to.have.property('status').equals(400)
                chai.expect(res.body)
                    .to.have.property('message')
                    .equals('Missing or incorrect firstName field')
                chai
                    .expect(res.body)
                    .to.have.property('data')
                    .that.is.a('object').that.is.empty

                done()
            })
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

    it('TC-201-4 Gebruiker bestaat al', (done) => {
        // Stel dat de eerste request de gebruiker registreert
        const duplicateUser = {
            firstName: 'New',
            lastName: 'User',
            emailAdress: 'exisiting@server.nl',
        };

        chai.request(server)
            .post('/api/users')
            .send(duplicateUser)
            .end((err, res) => {
                expect(res).to.have.status(400);
                expect(res.body).to.be.a('object');
                expect(res.body).to.have.property('status').equals("Error: Email already exists");

                done()
            });
            done();
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
    });
});

// Path: test/user.get.test.js
// New tests for fetching all users
// New tests for fetching a user by ID
describe("UC202 Retrieve user by ID", () => {
    it("should return a user by their ID when valid ID is provided", (done) => {
      chai
        .request(server)
        .get("/api/users/0") // Assuming there is a user with ID 0
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object");
          expect(res.body.data).to.have.property("id").eql(0);
          done();
        });
    });
 
    it("should return 404 when non-existing ID is provided", (done) => {
      chai
        .request(server)
        .get("/api/users/999") // Assuming no user with ID 999
        .end((err, res) => {
          expect(res).to.have.status(404);
          done();
        });
    });
  });