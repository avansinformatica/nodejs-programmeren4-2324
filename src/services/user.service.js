const database = require('../dao/inmem-db')
const logger = require('../util/logger')

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
        database.getAll((err, data) => {
            if (err) {
                callback(err, null)
            } else {
                callback(null, {
                    message: `Found ${data.length} users.`,
                    data: data
                })
            }
        })
    },

    getById: (userId, callback) => {
        logger.info('getUserById', userId);
        database.getById(userId, (err, user) => {
            if (err) {
                logger.error('Error getting user by ID:', err.message || 'unknown error');
                callback(err, null);
            } else {
                if (!user) {
                    const error = {
                        status: 404,
                        message: 'User not found'
                    };
                    logger.error(error.message);
                    callback(error, null);
                } else {
                    logger.trace(`User found with ID ${userId}`);
                    callback(null, {
                        message: `User found with ID ${userId}`,
                        data: user
                    });
                }
            }
        });
    },

    update: (userId, updatedUserData, callback) => {
        logger.info('Updating user with ID:', userId);
        database.update(userId, updatedUserData, (err, updatedUser) => {
            if (err) {
                logger.error('Error updating user:', err.message || 'unknown error');
                callback(err, null);
            } else {
                logger.trace('User updated successfully');
                callback(null, {
                    message: 'User updated successfully',
                    data: updatedUser
                });
            }
        });
    },

    delete: (userId, callback) => {
        logger.info('Deleting user with ID:', userId);
        database.delete(userId, (err, deletedUser) => {
            if (err) {
                logger.error('Error deleting user:', err.message || 'unknown error');
                callback(err, null);
            } else {
                logger.trace('User deleted successfully');
                callback(null, {
                    message: 'User deleted successfully',
                    data: deletedUser
                });
            }
        });
    }




}

module.exports = userService
