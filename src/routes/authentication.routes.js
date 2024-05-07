//
// Authentication routes
//
const assert = require('assert')
const routes = require('express').Router()
const AuthController = require('../controllers/authentication.controller')

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
    // logger.trace(req.headers)
    // The headers should contain the authorization-field with value 'Bearer [token]'
    const authHeader = req.headers.authorization
    if (!authHeader) {
        logger.warn('Authorization header missing!')
        res.status(401).json({
            error: 'Authorization header missing!',
            datetime: new Date().toISOString()
        })
    } else {
        // Strip the word 'Bearer ' from the headervalue
        const token = authHeader.substring(7, authHeader.length)

        jwt.verify(token, jwtSecretKey, (err, payload) => {
            if (err) {
                logger.warn('Not authorized')
                res.status(401).json({
                    error: 'Not authorized',
                    datetime: new Date().toISOString()
                })
            }
            if (payload) {
                logger.debug('token is valid', payload)
                // User heeft toegang. Voeg UserId uit payload toe aan
                // request, voor ieder volgend endpoint.
                req.userId = payload.userId
                next()
            }
        })
    }
}

routes.post('/login', validateLogin, AuthController.login)

module.exports = routes
