const userService = require('../services/user.service')
const logger = require('../util/logger')

let userController = {
    create: (req, res, next) => {
        const user = req.body
        logger.info('create user', user.firstName, user.lastName)
        userService.create(user, (error, success) => {
            if (error) {
                let statusCode
                switch (error.message) {
                    case 'Invalid email address':
                    case 'Password must be at least 8 characters long':
                    case 'Missing required fields':
                        statusCode = 400
                        break
                    case 'User already exists':
                    case 'User with this email address already exists':
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
                user.userId = success.data.userId
                return res.status(200).json({
                    status: 200,
                    message: success.message,
                    data: {
                        firstName: user.firstName,
                        lastName: user.lastName,
                        emailAdress: user.emailAdress,
                        password: user.password,
                        id: user.userId
                    }
                })
            }
        })
    },

    getAll: (req, res, next) => {
        logger.trace('getAll')

        const { firstName, lastName, isActive } = req.query // Gebruik req.query om query parameters op te halen

        userService.getAll(firstName, lastName, isActive, (error, success) => {
            if (error) {
                // Handle error
                let statusCode
                switch (error.message) {
                    case 'Missing required fields':
                        statusCode = 200
                        break
                    default:
                        statusCode = 200 // Internal Server Error
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
        const userId = req.params.userId
        logger.trace('userController: getById', userId)
        userService.getById(userId, (error, success) => {
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

    getProfile: (req, res, next) => {
        const userId = req.userId
        logger.trace('getProfile for userId', userId)
        userService.getProfile(userId, (error, success) => {
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

    // Todo: Implement the update and delete methods

    update: (req, res, next) => {
        const userId = req.params.userId
        const updatedUser = req.body
        logger.trace(`userController: update user with id ${userId}`)
        userService.update(userId, updatedUser, (error, result) => {
            if (error) {
                // Behandel de fout
                return next({
                    status: error.status,
                    message: error.message,
                    data: {}
                })
            } else {
                // Verwerk het resultaat
                res.status(200).json({
                    status: 200,
                    message: result.message,
                    data: result.data
                })
            }
        })
    },

    deleteUser: (req, res, next) => {
        const userId = req.params.userId
        logger.trace('userController: deleteUser', userId)
        userService.delete(userId, (error, success) => {
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
    }
}

module.exports = userController
