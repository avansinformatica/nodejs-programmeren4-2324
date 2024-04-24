const express = require('express')
const router = express.Router()
const userController = require('../controllers/user.controller')
const assert = require('assert')

// Userroutes
router.post('/api/users', userController.validateUser, userController.create)
router.get('/api/users', userController.getAll)
router.get('/api/users/:userId', userController.getById)
router.delete('/api/users/:userId', userController.deleteUser)
router.put('/api/users/:userId', userController.changeUser)

module.exports = router
