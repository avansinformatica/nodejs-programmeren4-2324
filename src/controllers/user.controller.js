const userService = require('../services/user.service')
const assert = require('assert')

let userController = {
    validateUser: (req, res, next) => {
        let user = req.body
        let { firstName, lastName, emailAdress } = user
        try {
            assert(typeof firstName === 'string', 'First name must be a string')
            assert(typeof lastName === 'string', 'Last name must be a string')
            assert(
                typeof emailAdress === 'string',
                'Email address must be a string'
            )
            next()
        } catch (err) {
            console.log(err)
            res.status(400).json({
                status: 400,
                message: err.message
            })
        }
    },
    create: (req, res, next) => {
        const user = req.body
        //
        // Todo: Validate user input
        //
        userService.create(user, (error, success) => {
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

    getAll: (req, res, next) => {
        userService.getAll((error, success) => {
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

    getById: (req, res, next) => {
        const userId = req.params.userId
        const myUserId = userId[1]
        // console.log('userid:' + userId)
        // console.log('correct userid: ' + myUserId)
        userService.getById(myUserId, (error, success) => {
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
    deleteUser: (req, res, next) => {
        const userId = req.params.userId
        const myUserId = userId[1]

        userService.deleteUser(myUserId, (error, success) => {
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

    changeUser: (req, res, next) => {
        const userId = req.params.userId
        const myUserId = userId[1]
        const user = req.body

        userService.changeUser(user, myUserId, (error, success) => {
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
