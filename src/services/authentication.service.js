//
// Authentication controller
//
const jwt = require('jsonwebtoken')
const db = require('../dao/mysql-db')
// const validateEmail = require('../util/emailvalidator')
const logger = require('../util/logger')
const { register } = require('../controllers/authentication.controller')
const jwtSecretKey = require('../util/config').secretkey

const authService = {
    login: (userCredentials, callback) => {
        logger.debug('login')

        db.getConnection((err, connection) => {
            if (err) {
                logger.error(err)
                callback(err.message, null)
            }
            if (connection) {
                // 1. Kijk of deze useraccount bestaat.
                connection.query(
                    'SELECT `id`, `emailAdress`, `password`, `firstName`, `lastName` FROM `user` WHERE `emailAdress` = ? ',
                    [userCredentials.emailAdress],
                    (err, rows, fields) => {
                        connection.release()
                        if (err) {
                            logger.error('Error: ', err.toString())
                            callback(err.message, null)
                        }
                        if (rows) {
                            // 2. Er was een resultaat, check het password.
                            if (
                                rows &&
                                rows.length === 1 &&
                                rows[0].password == userCredentials.password
                            ) {
                                logger.trace(
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
                                        logger.trace(
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
                                logger.trace(
                                    'User not found or password invalid'
                                )
                                callback(
                                    {
                                        status: 409,
                                        message:
                                            'User not found or password invalid',
                                        data: {}
                                    },
                                    null
                                )
                            }
                        }
                    }
                )
            }
        })
    },
    register: (data, callback) => {
        logger.debug('register')

        db.getConnection((err, connection) => {
            if (err) {
                logger.error(err)
                callback(err.message, null)
            }
            if (connection) {
                connection.query(
                    'INSERT INTO `user` (`emailAdress`, `password`, `firstName`, `lastName`, `phoneNumber`, `street`, `city`) VALUES (?, ?, ?, ?, ?, ?, ?)',
                    [
                        data.emailAdress,
                        data.password,
                        data.firstName,
                        data.lastName,
                        data.phoneNumber,
                        data.street,
                        data.city
                    ],
                    (err, result) => {
                        if (err) {
                            connection.release()
                            logger.error('Error: ', err.toString())
                            callback(err.message, null)
                        } else {
                            connection.query(
                                'SELECT `id` FROM `user` WHERE `emailAdress` = ?',
                                [data.emailAdress],
                                (err, rows) => {
                                    connection.release()
                                    if (err) {
                                        logger.error('Error: ', err.toString())
                                        callback(err.message, null)
                                    } else {
                                        logger.trace('User registered')
                                        callback(null, {
                                            status: 201,
                                            message: 'User registered',
                                            data: rows[0]
                                        })
                                    }
                                }
                            )
                        }
                    }
                )
            }
        })
    }
}

module.exports = authService
