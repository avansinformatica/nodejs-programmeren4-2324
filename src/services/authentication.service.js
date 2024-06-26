//
// Authentication controller
//
const jwt = require('jsonwebtoken')
const db = require('../dao/mysql-db')
// const validateEmail = require('../util/emailvalidator')
const logger = require('../util/logger')
const jwtSecretKey = require('../util/config').secretkey

const authController = {
    login: (userCredentials, callback) => {
        logger.debug('login')

        db.getConnection((err, connection) => {
            if (err) {
                logger.error(err)
                callback(err.message, null)
                return
            }
            if (connection) {
                // 1. Kijk of deze useraccount bestaat.
                connection.query(
                    'SELECT `id`, `emailAdress`, `password`, `firstName`, `lastName` FROM `user` WHERE `emailAdress` = ?',
                    [userCredentials.emailAdress],
                    (err, rows, fields) => {
                        connection.release()
                        if (err) {
                            logger.error('Error: ', err.toString())
                            callback(err.message, null)
                            return
                        }
                        if (rows && rows.length === 1) {
                            // 2. Er was een resultaat, check het password.
                            if (rows[0].password == userCredentials.password) {
                                logger.debug(
                                    'passwords DID match, sending userinfo and valid token'
                                )
                                // Extract the password from the userdata - we do not send that in the response.
                                const { password, ...userinfo } = rows[0]
                                // Create an object containing the data we want in the payload.
                                const payload = {
                                    userId: userinfo.id
                                }

                                jwt.sign(
                                    payload,
                                    jwtSecretKey,
                                    { expiresIn: '12d' },
                                    (err, token) => {
                                        if (err) {
                                            logger.error(
                                                'Error signing token: ',
                                                err.toString()
                                            )
                                            callback(err.message, null)
                                            return
                                        }
                                        logger.info(
                                            'User logged in, sending: ',
                                            userinfo
                                        )
                                        callback(null, {
                                            status: 200,
                                            message: 'User logged in',
                                            data: { ...userinfo, token }
                                        })
                                    }
                                )
                            } else {
                                logger.debug('User found, but password invalid')
                                callback(
                                    {
                                        status: 400,
                                        message: 'Password invalid',
                                        data: {}
                                    },
                                    null
                                )
                            }
                        } else {
                            logger.debug('User not found')
                            callback(
                                {
                                    status: 404,
                                    message: 'User not found',
                                    data: {}
                                },
                                null
                            )
                        }
                    }
                )
            }
        })
    },

    login2: (req, res, next) => {
        dbconnection.getConnection((err, connection) => {
            if (err) {
                logger.error('Error getting connection from dbconnection')
                return next({
                    status: err.status,
                    message: error.message,
                    data: {}
                })
            }
            if (connection) {
                // 1. Kijk of deze useraccount bestaat.
                connection.query(
                    'SELECT `id`, `emailAdress`, `password`, `firstName`, `lastName` FROM `user` WHERE `emailAdress` = ?',
                    [req.body.emailAdress],
                    (err, rows, fields) => {
                        connection.release()
                        if (err) {
                            logger.error('Error: ', err.toString())
                            return next({
                                status: err.status,
                                message: error.message,
                                data: {}
                            })
                        }
                        if (rows) {
                            // 2. Er was een resultaat, check het password.
                            if (
                                rows &&
                                rows.length === 1 &&
                                rows[0].password == req.body.password
                            ) {
                                logger.info(
                                    'passwords DID match, sending userinfo and valid token'
                                )
                                // Extract the password from the userdata - we do not send that in the response.
                                const { password, ...userinfo } = rows[0]
                                // Create an object containing the data we want in the payload.
                                const payload = {
                                    userId: userinfo.id
                                }

                                jwt.sign(
                                    payload,
                                    jwtSecretKey,
                                    { expiresIn: '12d' },
                                    function (err, token) {
                                        logger.debug(
                                            'User logged in, sending: ',
                                            userinfo
                                        )
                                        res.status(200).json({
                                            statusCode: 200,
                                            results: { ...userinfo, token }
                                        })
                                    }
                                )
                            } else {
                                logger.info(
                                    'User not found or password invalid'
                                )
                                return next({
                                    status: 409,
                                    message:
                                        'User not found or password invalid',
                                    data: {}
                                })
                            }
                        } else {
                            logger.debug('User not found')
                            callback(
                                {
                                    status: 404,
                                    message: 'User not found',
                                    data: {}
                                },
                                null
                            )
                        }
                    }
                )
            }
        })
    }
}

module.exports = authController
