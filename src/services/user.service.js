const database = require('../dao/inmem-db')
const logger = require('../util/logger')

const db = require('../dao/mysql-db')
const { get } = require('../..')

const userService = {
    create: (user, callback) => {
        logger.info('create user', user)
        database.add(user, (err, data) => {
            if (err) {
                logger.info(
                    'error creating user: ',
                    err.message || 'unknown error'
                )
                callback(err, null)
            } else {
                logger.trace(`User created with id ${data.id}.`)
                callback(null, {
                    message: `User created with id ${data.id}.`,
                    data: data
                })
            }
        })
    },

    getAll: (callback) => {
        logger.info('getAll')

        // Deprecated: de 'oude' manier van werken, met de inmemory database
        // database.getAll((err, data) => {
        //     if (err) {
        //         callback(err, null)
        //     } else {
        //         callback(null, {
        //             message: `Found ${data.length} users.`,
        //             data: data
        //         })
        //     }
        // })

        // Nieuwe manier van werken: met de MySQL database
        db.getConnection(function (err, connection) {
            if (err) {
                logger.error(err)
                callback(err, null)
                return
            }

            connection.query(
                'SELECT id, firstName, lastName FROM `user`',
                function (error, results, fields) {
                    connection.release()

                    if (error) {
                        logger.error(error)
                        callback(error, null)
                    } else {
                        logger.debug(results)
                        callback(null, {
                            message: `Found ${results.length} users.`,
                            data: results
                        })
                    }
                }
            )
        })
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
                'SELECT id, firstName, lastName FROM `user` WHERE id = ?',
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
        logger.info('getById userId:', userId)

        db.getConnection(function (err, connection) {
            if (err) {
                logger.error(err)
                callback(err, null)
                return
            }

            connection.query(
                'SELECT `emailAdress`, `phoneNumber`, `meal`.`name` AS `mealName` ' +
                    'FROM `user` ' +
                    'JOIN `meal` ON `user`.`id` = `meal`.`id` ' +
                    'WHERE `user`.`id` = ?',
                [userId],
                function (error, results) {
                    connection.release()

                    if (error) {
                        logger.error(error)
                        callback(error, null)
                    } else if (results.length === 0) {
                        // No user found, return 404
                        logger.info(`User with ID ${userId} not found`)
                        callback(null, {
                            status: 404,
                            message: 'User not found',
                            data: {}
                        })
                    } else {
                        // User found, return user details
                        logger.debug(results)
                        callback(null, {
                            status: 200,
                            message: `Found ${results.length} user${
                                results.length !== 1 ? 's' : ''
                            }.`,
                            data: results
                        })
                    }
                }
            )
        })
    }
}

module.exports = userService
