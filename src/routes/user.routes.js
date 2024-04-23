const express = require('express');
const router = express.Router();
const { userController, validateUserCreateAssert } = require('../controllers/user.controller'); 


// Tijdelijke functie om niet bestaande routes op te vangen
const notFound = (req, res, next) => {
    res.status(404).json({
        status: 404,
        message: 'Route not found',
        data: {}
    });
};

// Userroutes
// GET
router.get('/api/users', userController.getAll);
router.get('/api/users/:userId', userController.getById);

// POST
router.post('/api/users', validateUserCreateAssert, userController.create);


// PUT
router.put('/api/users/:userId', validateUserCreateAssert, userController.update);

// DELETE
router.delete('/api/users/:userId', userController.delete);

module.exports = router;
