const jwt = require('jsonwebtoken')
const logger = require('../util/logger')
const db = require('../dao/mysql-db')

const mealService = {
    create: (newMeal, callback) => {
        logger.info('create meal:', newMeal)

        // Controleer of alle verplichte velden aanwezig zijn
        if (
            !newMeal.name ||
            !newMeal.price ||
            !newMeal.maxAmountOfParticipants
        ) {
            return callback(new Error('Missing required fields'), 400)
        }

        db.getConnection((err, connection) => {
            if (err) {
                logger.error(err)
                callback(err, null)
                return
            }

            connection.query(
                'INSERT INTO `meal` SET?',
                newMeal,
                (error, results, fields) => {
                    connection.release()
                    if (error) {
                        if (
                            error.message &&
                            error.message.includes('Duplicate entry')
                        ) {
                            return callback(
                                new Error('Meal with this name already exists'),
                                null
                            )
                        } else {
                            logger.error(error)
                            return callback(error, null)
                        }
                    } else {
                        const mealId = results.insertId
                        logger.trace(`Meal created successfully`)
                        const success = {
                            message: `Meal created successfully`,
                            data: {
                                mealId: mealId
                            }
                        }
                        callback(null, success)
                    }
                }
            )
        })
    },

    update: (mealId, updatedMeal, token, callback) => {
        logger.info('update meal', mealId, updatedMeal)

        const decoded = jwt.decode(token.split(' ')[1])
        let tokenUserId = parseInt(decoded.userId, 10)

        // Haal de userId van de maaltijd op uit de database
        db.getConnection((err, connection) => {
            if (err) {
                logger.error(err)
                callback(err, null)
                return
            }

            connection.query(
                'SELECT cookId FROM `meal` WHERE id = ?',
                [mealId],
                (error, results, fields) => {
                    if (error) {
                        connection.release()
                        logger.error(error)
                        callback(error, null)
                        return
                    }

                    if (results.length === 0) {
                        connection.release()
                        callback(new Error('Meal not found'), null)
                        return
                    }

                    const mealUserId = results[0].cookId

                    // Controleer of de userId van de maaltijd overeenkomt met de tokenUserId
                    if (mealUserId === tokenUserId) {
                        if (!updatedMeal.name) {
                            connection.release()
                            return callback(
                                new Error('Missing required fields'),
                                400
                            )
                        } else if (!updatedMeal.price) {
                            connection.release()
                            return callback(
                                new Error('Missing required fields'),
                                400
                            )
                        } else if (!updatedMeal.maxAmountOfParticipants) {
                            connection.release()
                            return callback(
                                new Error('Missing required fields'),
                                400
                            )
                        } else {
                            connection.query(
                                'UPDATE `meal` SET ? WHERE id = ?',
                                [updatedMeal, mealId],
                                function (error, results, fields) {
                                    connection.release()

                                    if (error) {
                                        logger.error(error)
                                        callback(error, null)
                                    } else {
                                        logger.trace(
                                            `Meal updated with id ${mealId}.`
                                        )
                                        callback(null, {
                                            message: `Meal updated with id ${mealId}`,
                                            data: results
                                        })
                                    }
                                }
                            )
                        }
                    } else {
                        connection.release()
                        callback(
                            new Error('Je bent niet de eigenaar van de data'),
                            null
                        )
                    }
                }
            )
        })
    },

    getAll: (callback) => {
        logger.info('getAll')

        db.query('SELECT * FROM meal', (error, results, fields) => {
            if (error) {
                logger.error(error)
                return callback(error, null)
            }

            logger.debug(results)
            if (results.length === 0) {
                callback(null, {
                    message: 'No meals found',
                    data: []
                })
            } else {
                callback(null, {
                    message: 'Meals found',
                    data: results
                })
            }
        })
    },

    getById: (mealId, callback) => {
        logger.info('getById mealId', mealId)
        db.getConnection(function (err, connection) {
            if (err) {
                logger.error(err)
                callback(err, null)
                return
            }

            connection.query(
                'SELECT * FROM `meal` WHERE id = ?',
                [mealId],
                function (error, results, fields) {
                    connection.release()

                    if (error) {
                        logger.error(error)
                        callback(error, null)
                    } else {
                        logger.debug(results)
                        callback(null, {
                            message: `Found ${results.length} meal.`,
                            data: results
                        })
                    }
                }
            )
        })
    },

    delete: (mealId, token, callback) => {
        logger.info('delete meal', mealId)

        const decoded = jwt.decode(token.split(' ')[1])
        let tokenUserId = parseInt(decoded.userId, 10)

        // Haal de userId van de maaltijd op uit de database
        db.getConnection((err, connection) => {
            if (err) {
                logger.error(err)
                callback(err, null)
                return
            }

            connection.query(
                'SELECT cookId FROM `meal` WHERE id = ?',
                [mealId],
                (error, results, fields) => {
                    if (error) {
                        connection.release()
                        logger.error(error)
                        callback(error, null)
                        return
                    }

                    if (results.length === 0) {
                        connection.release()
                        callback(new Error('Meal not found'), null)
                        return
                    }

                    const mealUserId = results[0].cookId

                    // Controleer of de userId van de maaltijd overeenkomt met de tokenUserId
                    if (mealUserId === tokenUserId) {
                        connection.query(
                            'DELETE FROM `meal` WHERE id = ?',
                            [mealId],
                            function (error, results, fields) {
                                connection.release()

                                if (error) {
                                    logger.error(error)
                                    callback(error, null)
                                } else {
                                    logger.debug(results)
                                    callback(null, {
                                        message: `Meal with id ${mealId} deleted.`,
                                        data: results
                                    })
                                }
                            }
                        )
                    } else {
                        connection.release()
                        callback(
                            new Error('Je bent niet de eigenaar van de data'),
                            null
                        )
                    }
                }
            )
        })
    }
}

module.exports = mealService
