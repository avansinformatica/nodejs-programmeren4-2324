const express = require('express')
const router = express.Router()
const userController = require('../controllers/user.controller')
const assert = require('assert')

const validateUser = (req, res, next) => {
    let user = req.body
    let { firstName, lastName, emailAdress } = user
    try {
        assert(
            typeof firstName === 'string',
            'First name is missing or is not a string'
        )
        assert(
            typeof lastName === 'string',
            'Last name is missing or is not a string'
        )
        assert(
            typeof emailAdress === 'string',
            'Email address is missing or is not a string'
        )
        next()
    } catch (err) {
        console.log(err)
        // res.status(400).json({
        //     status: 400,
        //     message: err.message
        // })
        return next({
            // error wordt doorgestuurd naar de error handler in index.js
            status: 400,
            message: err.message,
            data: {}
        })
    }
}

// Userroutes
router.post('/api/users', validateUser, userController.create)
router.get('/api/users', userController.getAll)
router.get('/api/users/:userId', userController.getById)
router.delete('/api/users/:userId', userController.deleteUser)
router.put('/api/users/:userId', userController.changeUser)

module.exports = router
