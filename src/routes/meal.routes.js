const express = require('express')
const assert = require('assert')
const chai = require('chai')
chai.should()
const router = express.Router()
const mealController = require('../controllers/meal.controller')
const validateToken = require('./authentication.routes').validateToken

// Mealroutes
router.post('/api/meal', validateToken, mealController.create)
router.put('/api/meal/:mealId', validateToken, mealController.update)
router.get('/api/meal', mealController.getAll)
router.get('/api/meal/:mealId', mealController.getById)
router.delete('/api/meal/:mealId', validateToken, mealController.deleteMeal)

module.exports = router
