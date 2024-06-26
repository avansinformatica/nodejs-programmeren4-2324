const express = require('express')
const assert = require('assert')
const chai = require('chai')
chai.should()
const router = express.Router()
const userController = require('../controllers/user.controller')
const mealController = require('../controllers/meal.controller')
const validateToken = require('./authentication.routes').validateToken
const logger = require('../util/logger')

// Tijdelijke functie om niet bestaande routes op te vangen
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

const logRequest = (req, res, next) => {
    console.log('Request object:', req)
    next()
}

// Userroutes
router.post('/api/user', validateUserCreate, userController.create)
router.get('/api/user', userController.getAll)
router.get('/api/user/profile', validateToken, userController.getProfile)
router.get('/api/user/:userId', validateToken, userController.getById)
router.put('/api/user/:userId', validateToken, userController.update)
router.delete('/api/user/:userId', validateToken, userController.deleteUser)

// Tijdelijke routes om niet bestaande routes op te vangen
router.put('/api/user/:userId', notFound)
router.delete('/api/user/:userId', notFound)

module.exports = router
