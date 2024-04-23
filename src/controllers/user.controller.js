const userService = require('../services/user.service');
const { validationResult, body } = require('express-validator');

const validateUserCreateAssert = [
    body('firstName').notEmpty().withMessage('firstName is required'),
    body('lastName').notEmpty().withMessage('lastName is required'),
    body('emailAddress').notEmpty().withMessage('emailAddress is required'),
];

let userController = {
    create: (req, res, next) => {
        const user = req.body;

        // input validatie
        validateUserCreateAssert.forEach(validation => {
            validation.run(req);
        });

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        userService.create(user, (error, success) => {
            if (error) {
                return next({
                    status: error.status,
                    message: error.message,
                    data: {}
                });
            }
            if (success) {
                res.status(200).json({
                    status: success.status,
                    message: success.message,
                    data: success.data
                });
            }
        });
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

  
    // update
    update: (req, res, next) => {
        const userId = req.params.userId;
        const updatedUser = req.body;
    
        userService.update(userId, updatedUser, (error, success) => {
            if (error) {
                return next({
                    status: error.status,
                    message: error.message,
                    data: {}
                });
            }
            if (success) {
                res.status(200).json({
                    status: success.status,
                    message: success.message,
                    data: success.data
                });
            }
        });
    },
    

    // delete
    delete: (req, res, next) => {
        const userId = req.params.userId;
        userService.delete(userId, (error, success) => {
            if (error) {
                console.log("Error")
                return next({
                    status: error.status,
                    message: error.message,
                    data: {}
                });
            }
            
            if (success) {
                console.log("Succes")
                res.status(200).json({
                    status: success.status,
                    message: success.message,
                    data: success.data
                });
            }
        });
    }


}

module.exports = {userController, validateUserCreateAssert};
