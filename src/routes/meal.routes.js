const express = require('express')
const assert = require('assert')
const chai = require('chai')
chai.should()
const router = express.Router()
const mealController = require('../controllers/meal.controller')
const validateToken = require('./authentication.routes').validateToken
const logger = require('../util/logger')

const validateMealCreate = (req, res, next) => {
    try {
        assert(req.body.name, 'Missing or incorrect name field')
        assert(req.body.description, 'Missing or incorrect description field')
        assert(req.body.price, 'Missing or incorrect price field')
        chai.expect(req.body.name).to.not.be.empty
        chai.expect(req.body.name).to.be.a('string')

        chai.expect(req.body.description).to.not.be.empty
        chai.expect(req.body.description).to.be.a('string')

        chai.expect(req.body.price).to.not.be.null
        chai.expect(req.body.price).to.be.a('number')
        chai.expect(req.body.datetime).to.not.be.empty
        chai.expect(new Date(req.body.datetime).toString() !== 'Invalid Date')
            .to.be.true
        chai.expect(req.body.imageURL).to.not.be.empty
        chai.expect(req.body.imageURL).to.be.a('string')
        chai.expect(req.body.imageURL).to.match(
            /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:\d+)?(\/[^\s]*)?$/
        )
        chai.expect(req.body.cookId).to.be.empty
        logger.trace('Meal successfully validated')
        next()
    } catch (ex) {
        logger.trace('Meal validation failed:', ex.message)
        next({
            status: 400,
            message: ex.message,
            data: {}
        })
    }
}

router.post(
    '/meal/create',
    validateToken,
    validateMealCreate,
    mealController.create
)

module.exports = router
