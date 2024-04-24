const express = require('express')
const router = express.Router()
const userController = require('../controllers/user.controller')
const assert = require('assert')

// Assert validations
// const validateUserCreateAssert = (callback) => {
//     try {
//         assert.strictEqual(2 + 2, 4, '2 + 2 should be equal to 4')
//         callback(null)
//     } catch (error) {
//         callback(error)
//     }
// }

// validateUserCreateAssert((error) => {
//     if (error) {
//         console.error(error)
//     } else {
//         console.log('Assertion passed successfully')
//         // Proceed with your logic here
//     }
// })
// const validateUserCreateAssert = (callback) => {
//     try {
//         assert.ok
//         callback(null)
//     } catch (error) {
//         callback(error)
//     }
// }

// validateUserCreateAssert((error) => {
//     if (error) {
//         console.error(error)
//     } else {
//         console.log('Assertion passed successfully')
//         // Proceed with your logic here
//     }
// })

// Userroutes
router.post('/api/users', userController.create)
router.get('/api/users', userController.getAll)
router.get('/api/users/:userId', userController.getById)
router.delete('/api/users/:userId', userController.deleteUser)
router.put('/api/users/:userId', userController.changeUser)

module.exports = router
