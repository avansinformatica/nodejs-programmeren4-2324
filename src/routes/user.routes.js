const express = require('express')
const assert = require('assert')
const chai = require('chai')
chai.should()
const router = express.Router()
const userController = require('../controllers/user.controller')
const validateToken = require('./authentication.routes').validateToken
const logger = require('../util/logger')

const notFound = (req, res, next) => {
    next({
        status: 404,
        message: 'Route not found',
        data: {}
    })
}

const validateUserCreate = (req, res, next) => {
    try {
        assert(req.body.firstName, 'Missing or incorrect firstName field')
        chai.expect(req.body.firstName).to.not.be.empty
        chai.expect(req.body.firstName).to.be.a('string')
        chai.expect(req.body.firstName).to.match(
            /^[a-zA-Z]+$/,
            'firstName must be a string'
        )
        logger.trace('User successfully validated')
        next()
    } catch (ex) {
        logger.trace('User validation failed:', ex.message)
        next({
            status: 400,
            message: ex.message,
            data: {}
        })
    }
}

const validateUserUpdate = (req, res, next) => {
    try {
        const body = req.body
        assert(body.firstName, 'Missing or incorrect firstName field')
        assert(body.lastName, 'Missing or incorrect lastName field')
        assert(body.emailAdress, 'Missing or incorrect emailAdress field')
        assert(body.phoneNumber, 'Missing or incorrect phoneNumber field')
        assert(body.street, 'Missing or incorrect street field')
        assert(body.city, 'Missing or incorrect city field')
        chai.expect(body.firstName).to.not.be.empty
        chai.expect(body.firstName).to.be.a('string')
        chai.expect(body.firstName).to.match(
            /^[a-zA-Z]+$/,
            'firstName must be a string'
        )

        chai.expect(body.lastName).to.not.be.empty
        chai.expect(body.lastName).to.be.a('string')
        chai.expect(body.lastName).to.match(
            /^[a-zA-Z]+$/,
            'lastName must be a string'
        )

        chai.expect(body.emailAdress, 'Invalid emailAdress').to.match(
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        )

        chai.expect(body.phoneNumber, 'Invalid phoneNumber').to.match(
            /^(?:\+31\s?|0)?6[\s-]?[1-9][0-9]{7}$/
        )
        next()
    } catch (ex) {
        logger.trace('User validation failed:', ex.message)
        next({
            status: 400,
            message: ex.message,
            data: {}
        })
    }
}

// User routes
router.post('/api/user', validateUserCreate, userController.create)
router.get('/api/user', validateToken, userController.getAll)
router.get('/api/user/profile', validateToken, userController.getProfile)
router.get('/api/user/:userId', userController.getById)
router.put(
    '/api/user/update',
    validateToken,
    validateUserUpdate,
    userController.updateUser
)
router.delete('/api/user/delete', validateToken, userController.deleteUser)
// Temporary routes to handle non-existent routes
router.put('/api/user/:userId', notFound)
router.delete('/api/user/:userId', notFound)

module.exports = router
