const express = require('express')
const assert = require('assert')
const chai = require('chai')
chai.should()
const router = express.Router()
const userController = require('../controllers/user.controller')
const logger = require('../util/logger')
const database = require('../dao/inmem-db')

// Tijdelijke functie om niet bestaande routes op te vangen
const notFound = (req, res, next) => {
    next({
        status: 404,
        message: 'Route not found',
        data: {}
    })
}

// Input validation functions for user routes
const validateUserCreate = (req, res, next) => {
    if (!req.body.emailAdress || !req.body.firstName || !req.body.lastName) {
        next({
            status: 400,
            message: 'Missing email or password',
            data: {}
        })
    }
    next()
}


// Input validation function using Chai for POST /api/user
const validateUserCreateChaiExpect = async (req, res, next) => {
    try {
        // Validate first name
        chai.expect(req.body.firstName).to.not.be.empty;
        chai.expect(req.body.firstName).to.be.a('string');

        // Validate last name
        chai.expect(req.body.lastName).to.not.be.empty;
        chai.expect(req.body.lastName).to.be.a('string');

        // Validate email address
        chai.expect(req.body.emailAdress).to.not.be.empty;
        chai.expect(req.body.emailAdress).to.be.a('string');
        chai.expect(req.body.emailAdress).to.match(/@/);

        // Check if email is unique
        const isUnique = await checkEmailUniqueness(req.body.emailAdress);
        if (!isUnique) {
            throw new Error('Email address is already in use');
        }

        logger.trace('User successfully validated');
        next();
    } catch (ex) {
        logger.error('User validation failed:', ex.message);
        next({
            status: 400,
            message: ex.message,
            data: {}
        });
    }
};


// Function to check email uniqueness
const checkEmailUniqueness = async (email) => {
    return new Promise((resolve, reject) => {
        database.checkEmailUnique(email, (err, isUnique) => {
            if (err) {
                reject(err);
            } else {
                resolve(isUnique);
            }
        });
    });
};


// Userroutes
router.post('/api/user', validateUserCreateChaiExpect, userController.create)
router.get('/api/user', userController.getAll)
router.get('/api/user/:userId', userController.getById)

// Tijdelijke routes om niet bestaande routes op te vangen
router.put('/api/user/:userId', userController.update)
router.delete('/api/user/:userId', userController.delete)

module.exports = router
