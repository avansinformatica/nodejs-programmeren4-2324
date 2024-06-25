const logger = require('../util/logger')
const mealService = require('../services/meal.service')

let mealController = {
    create: (req, res, next) => {
        const meal = req.body
        const cookId = req.userId
        meal.cookId = cookId
        logger.info('create meal', meal.name)
        mealService.create(meal, (error, success) => {
            if (error) {
                return next({
                    status: error.status || 500,
                    message: error.message,
                    data: {}
                })
            }
            if (success) {
                res.status(200).json({
                    status: success.status || 200,
                    message: success.message,
                    data: success.data
                })
            }
        })
    },
    update: (req, res, next) => {
        const meal = req.body
        const mealId = req.body.mealId
        const cookId = req.userId
        logger.info(cookId)
        logger.info('update meal', mealId)

        mealService.update(mealId, meal, cookId, (error, success) => {
            if (error) {
                return next({
                    status: error.status || 500,
                    message: error.message,
                    data: {}
                })
            }
            if (success) {
                res.status(200).json({
                    status: success.status || 200,
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
                return next({
                    status: error.status,
                    message: error.message,
                    data: {}
                })
            }
            if (success) {
                res.status(200).json({
                    status: 200,
                    message: success.message,
                    data: success.data
                })
            }
        })
    },

    getMealById: (req, res, next) => {
        const mealId = req.params.mealId
        logger.trace('mealController: getMealById', mealId)
        mealService.getMealById(mealId, (error, success) => {
            if (error) {
                return next({
                    status: error.status,
                    message: error.message,
                    data: {}
                })
            }
            if (success) {
                res.status(200).json({
                    status: success.status,
                    message: success.message,
                    data: success.data
                })
            }
        })
    },
    delete: (req, res, next) => {
        const meal = req.body
        const cookId = req.userId
        logger.info(meal)
        logger.info('delete meal', meal)
        mealService.delete(meal, cookId, (error, success) => {
            if (error) {
                return next({
                    status: error.status || 500,
                    message: error.message,
                    data: {}
                })
            }
            if (success) {
                res.status(200).json({
                    status: success.status || 200,
                    message: success.message,
                    data: success.data
                })
            }
        })
    }
}
module.exports = mealController
