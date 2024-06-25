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
    }
}

module.exports = mealController
