//
// Authentication routes
//
const assert = require('assert')
const jwt = require('jsonwebtoken')
const jwtSecretKey = require('../util/config').secretkey
const routes = require('express').Router()
const AuthController = require('../controllers/authentication.controller')
const logger = require('../util/logger')
chai = require('chai')
chai.should()
const { CharsetToEncoding } = require('mysql2')

//
//
//
function validateLogin(req, res, next) {
    // Verify that we receive the expected input
    try {
        assert(
            typeof req.body.emailAdress === 'string',
            'email must be a string.'
        )
        assert(
            typeof req.body.password === 'string',
            'password must be a string.'
        )
        next()
    } catch (ex) {
        next({
            status: 409,
            message: ex.toString(),
            data: {}
        })
    }
}

//
//
//
function validateToken(req, res, next) {
    logger.info('validateToken called')
    logger.trace('Headers:', req.headers)
    // The headers should contain the authorization-field with value 'Bearer [token]'
    const authHeader = req.headers.authorization
    if (!authHeader) {
        logger.warn('Authorization header missing!')
        next({
            status: 401,
            message: 'Authorization header missing!',
            data: {}
        })
    } else {
        // Strip the word 'Bearer ' from the headervalue
        const token = authHeader.substring(7, authHeader.length)

        jwt.verify(token, jwtSecretKey, (err, payload) => {
            if (err) {
                logger.warn('Not authorized')
                next({
                    status: 401,
                    message: 'Not authorized!',
                    data: {}
                })
            }
            if (payload) {
                logger.debug('token is valid', payload)
                /**
                 * User heeft toegang.
                 * BELANGRIJK! Voeg UserId uit payload toe aan request,
                 * zodat die voor ieder volgend endpoint beschikbaar is.
                 * Je hebt dan altijd toegang tot de userId van de ingelogde gebruiker.
                 */
                req.userId = payload.userId
                next()
            }
        })
    }
}
function validateRegistion(req, res, next) {
    // Verify that we receive the expected input
    try {
        const body = req.body
        chai.expect(body, 'Missing emailaddress').to.have.property(
            'emailAdress'
        )
        //check if everything is here
        chai.expect(body, 'Missing password').to.have.property('password')
        chai.expect(body, 'Missing firstname').to.have.property('firstName')
        chai.expect(body, 'Missing lastname').to.have.property('lastName')
        chai.expect(body, 'Missing phoneNumber').to.have.property('phoneNumber')
        chai.expect(body, 'Missing street').to.have.property('street')
        chai.expect(body, 'Missing city').to.have.property('city')
        // check if everything is a valid value
        chai.expect(body.emailAdress, 'Invalid emailAdress').to.be.a('string')
        chai.expect(body.password, 'Invalid password').to.be.a('string')
        chai.expect(body.firstName, 'Invalid firstName').to.be.a('string')
        chai.expect(body.lastName, 'Invalid lastName').to.be.a('string')
        chai.expect(body.phoneNumber, 'Invalid phoneNumber').to.be.a('string')
        chai.expect(body.street, 'Invalid street').to.be.a('string')
        chai.expect(body.city, 'Invalid city').to.be.a('string')

        // validate the email and phonenumber
        chai.expect(body.emailAdress, 'Invalid emailAdress').to.match(
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        )

        chai.expect(body.phoneNumber, 'Invalid phoneNumber').to.match(
            /^(?:\+31\s?|0)?6[\s-]?[1-9][0-9]{7}$/
        )

        next()
    } catch (ex) {
        next({
            status: 400,
            message: ex.toString(),
            data: {}
        })
    }
}

routes.post('/login', validateLogin, AuthController.login)
routes.post('/register', validateRegistion, AuthController.register)

module.exports = { routes, validateToken }
