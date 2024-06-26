const mealService = require('../services/meal.service')
const logger = require('../util/logger')

let mealController = {
    create: (req, res, next) => {
        const meal = req.body
        logger.info('create meal', meal.id)
        mealService.create(meal, (error, success) => {
            if (error) {
                let statusCode
                switch (error.message) {
                    case 'Missing required fields':
                        statusCode = 400
                        break
                    default:
                        statusCode = 500 // Internal Server Error
                        break
                }
                return res.status(statusCode).json({
                    status: statusCode,
                    message: error.message,
                    data: {}
                })
            }
            if (success) {
                return res.status(201).json({
                    status: 201,
                    message: success.message,
                    data: {
                        meal
                    }
                })
            }
        })
    },

    update: (req, res, next) => {
        const mealId = req.params.mealId
        const updatedMeal = req.body
        const token = req.headers['authorization']

        logger.info('update meal', mealId)

        mealService.update(mealId, updatedMeal, token, (error, success) => {
            if (error) {
                let statusCode
                switch (error.message) {
                    case 'Missing required fields':
                        statusCode = 400
                        break
                    case 'Meal not found':
                        statusCode = 404
                        break
                    case 'Je bent niet de eigenaar van de data':
                        statusCode = 403
                        break
                    default:
                        statusCode = 500 // Internal Server Error
                        break
                }
                return res.status(statusCode).json({
                    status: statusCode,
                    message: error.message,
                    data: {}
                })
            }
            if (success) {
                return res.status(200).json({
                    status: 200,
                    message: success.message,
                    data: success.data
                })
            }
        })
    },

    getAll: (req, res, next) => {
        logger.trace('getAll')

        mealService.getAll((error, success) => {
            if (error) {
                // Handle error
                let statusCode
                switch (error.message) {
                    default:
                        statusCode = 500 // Internal Server Error
                        break
                }
                return res.status(statusCode).json({
                    status: statusCode,
                    message: error.message,
                    data: {}
                })
            } else {
                // Handle success
                res.status(200).json({
                    status: 200,
                    message: success.message,
                    data: success.data
                })
            }
        })
    },

    getById: (req, res, next) => {
        const mealId = req.params.mealId
        logger.trace('userController: getById', mealId)
        mealService.getById(mealId, (error, success) => {
            if (error) {
                return next({
                    status: error.status,
                    message: error.message,
                    data: {}
                })
            }
            if (success) {
                if (success.message === 'Found 0 meal.') {
                    res.status(404).json({
                        message: 'meal bestaat niet',
                        data: {}
                    })
                } else {
                    res.status(200).json({
                        status: success.status,
                        message: success.message,
                        data: success.data
                    })
                }
            }
        })
    },

    deleteMeal: (req, res, next) => {
        const mealId = req.params.mealId
        const token = req.headers.authorization
        logger.trace('userController: deleteUser', mealId)
        mealService.delete(mealId, token, (error, success) => {
            if (error) {
                let statusCode
                switch (error.message) {
                    case 'Je bent niet de eigenaar van de data':
                        statusCode = 403
                        break
                    case 'Meal not found':
                        statusCode = 404
                        break
                    default:
                        statusCode = 500 // Internal Server Error
                        break
                }
                return res.status(statusCode).json({
                    status: statusCode,
                    message: error.message,
                    data: {}
                })
            }
            if (success) {
                res.status(200).json({
                    status: success.status,
                    message: success.message
                })
            }
        })
    }
}

module.exports = mealController
