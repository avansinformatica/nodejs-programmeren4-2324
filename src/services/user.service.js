const database = require('../dao/inmem-db')
const logger = require('../util/logger')

const db = require('../dao/mysql-db')

const jwt = require('jsonwebtoken')

const userService = {
    create: (newUser, callback) => {
        logger.info('create user:', newUser)
        const emailRegex = /^.+@.+\..+$/
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/

        if (!emailRegex.test(newUser.emailAdress)) {
            return callback(new Error('Invalid email address'), null)
        } else if (!newUser.password || !passwordRegex.test(newUser.password)) {
            return callback(
                new Error('Password must be at least 8 characters long'),
                null
            )
        } else {
            db.getConnection((err, connection) => {
                if (err) {
                    logger.error(err)
                    callback(err, null)
                    return
                }

                connection.query(
                    'INSERT INTO `user` SET ?',
                    newUser,
                    (error, results, fields) => {
                        connection.release()
                        if (error) {
                            if (
                                error.message &&
                                error.message.includes('Duplicate entry')
                            ) {
                                return callback(
                                    new Error(
                                        'User with this email address already exists'
                                    ),
                                    null
                                )
                            } else {
                                logger.error(error)
                                return callback(error, null)
                            }
                        } else {
                            const userId = results.insertId
                            logger.trace(`User created with ID ${userId}`)
                            const success = {
                                message: `User created with ID ${userId}`,
                                data: {
                                    userId: userId
                                }
                            }
                            callback(null, success)
                        }
                    }
                )
            })
        }
    },

    getAll: (userFirstName, userLastName, userIsActive, callback) => {
        logger.info('getAll')

        // Controleer of alle parameters leeg zijn
        if (!userFirstName && !userLastName && userIsActive === undefined) {
            // Voer de query uit zonder WHERE-clausule
            db.query(
                'SELECT id, firstName, lastName FROM user',
                (error, results, fields) => {
                    if (error) {
                        logger.error(error)
                        return callback(error, null)
                    }

                    logger.debug(results)
                    if (results.length === 0) {
                        callback(null, {
                            message: 'No users found',
                            data: []
                        })
                    } else {
                        callback(null, {
                            message: 'Users found',
                            data: results
                        })
                    }
                }
            )
        } else {
            // Bouw de WHERE-clausule dynamisch op op basis van de opgegeven parameters
            let whereClause = ''
            let values = []
            if (userFirstName !== 'firstName') {
                whereClause += 'firstName = ? AND '
                values.push(userFirstName)
            }
            if (userLastName !== 'lastName') {
                whereClause += 'lastName = ? AND '
                values.push(userLastName)
            }
            if (userIsActive !== undefined) {
                whereClause += 'isActive = ? AND '
                values.push(userIsActive)
            }

            // Verwijder de laatste 'AND' uit de WHERE-clausule
            if (whereClause !== '') {
                whereClause = 'WHERE ' + whereClause.slice(0, -5)
            }

            // Voer de query uit met de dynamisch opgebouwde WHERE-clausule
            db.query(
                `SELECT id, firstName, lastName, isActive FROM user ${whereClause}`,
                values,
                (error, results, fields) => {
                    if (error) {
                        logger.error(error)
                        return callback(error, null)
                    }

                    logger.debug(results)
                    if (results.length === 0) {
                        callback(null, {
                            message: 'No users found',
                            data: []
                        })
                    } else {
                        callback(null, {
                            message: 'Users found',
                            data: results
                        })
                    }
                }
            )
        }
    },

    getProfile: (userId, callback) => {
        logger.info('getProfile userId:', userId)

        db.getConnection(function (err, connection) {
            if (err) {
                logger.error(err)
                callback(err, null)
                return
            }

            connection.query(
                'SELECT id, firstName, lastName, isActive FROM `user` WHERE id = ?',
                [userId],
                function (error, results, fields) {
                    connection.release()

                    if (error) {
                        logger.error(error)
                        callback(error, null)
                    } else {
                        logger.debug(results)
                        callback(null, {
                            message: `Found ${results.length} user.`,
                            data: results
                        })
                    }
                }
            )
        })
    },

    getById: (userId, callback) => {
        logger.info('getById userId', userId)
        db.getConnection(function (err, connection) {
            if (err) {
                logger.error(err)
                callback(err, null)
                return
            }

            connection.query(
                'SELECT id, firstName, lastName, isActive FROM `user` WHERE id = ?',
                [userId],
                function (error, results, fields) {
                    connection.release()

                    if (error) {
                        logger.error(error)
                        callback(error, null)
                    } else {
                        logger.debug(results)
                        callback(null, {
                            message: `Found ${results.length} user.`,
                            data: results
                        })
                    }
                }
            )
        })
    },

    update: (userId, updatedUser, token, callback) => {
        logger.info('update user', userId, updatedUser)

        const phoneRegex = /^\+?[\d\s()-]*$/

        const decoded = jwt.decode(token.split(' ')[1])

        let tokenUserId = decoded.userId

        userId = parseInt(userId, 10) // Converteer naar integer met base 10

        tokenUserId = parseInt(decoded.userId, 10) // Converteer naar integer met base 10

        // console.log(tokenUserId)

        // console.log(userId)

        if (userId === tokenUserId) {
            if (!updatedUser.emailAdress) {
                return callback(
                    new Error('Verplicht veld “emailAddress” ontbreekt'),
                    null
                )
            } else if (!phoneRegex.test(updatedUser.phoneNumber)) {
                return callback(
                    new Error('PhoneNumber must only contain numbers'),
                    null
                )
            } else {
                db.getConnection(function (err, connection) {
                    if (err) {
                        logger.error(err)
                        callback(err, null)
                        return
                    }

                    connection.query(
                        'UPDATE `user` SET ? WHERE id = ?',
                        [updatedUser, userId],
                        function (error, results, fields) {
                            connection.release()

                            if (error) {
                                logger.error(error)
                                callback(error, null)
                            } else {
                                logger.trace(`User updated with id ${userId}.`)
                                callback(null, {
                                    message: `User updated with id ${userId}.`,
                                    data: results
                                })
                            }
                        }
                    )
                })
            }
        } else {
            return callback(
                new Error('Je bent niet de eigenaar van de data'),
                null
            )
        }
    },

    delete: (userId, token, callback) => {
        logger.info('delete user', userId)

        const decoded = jwt.decode(token.split(' ')[1])

        let tokenUserId = decoded.userId

        userId = parseInt(userId, 10) // Converteer naar integer met base 10

        tokenUserId = parseInt(decoded.userId, 10) // Converteer naar integer met base 10

        if (userId === tokenUserId) {
            db.getConnection(function (err, connection) {
                if (err) {
                    logger.error(err)
                    callback(err, null)
                    return
                }

                connection.query(
                    'DELETE FROM `user` WHERE id = ?',
                    [userId],
                    function (error, results, fields) {
                        connection.release()

                        if (error) {
                            logger.error(error)
                            callback(error, null)
                        } else {
                            logger.debug(results)
                            callback(null, {
                                message: `User with id ${userId} deleted.`,
                                data: results
                            })
                        }
                    }
                )
            })
        } else {
            return callback(
                new Error('Je bent niet de eigenaar van de data'),
                null
            )
        }
    }
}

module.exports = userService
