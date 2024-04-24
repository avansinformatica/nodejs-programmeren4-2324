const database = require('../dao/inmem-db')
var logger = require('tracer').console()

const userService = {
    create: (user, callback) => {
        logger.log('hello')
        database.add(user, (err, data) => {
            if (err) {
                callback(err, null)
            } else {
                callback(null, {
                    message: `User created with id ${data.id}.`,
                    data: data
                })
            }
        })
    },

    getAll: (callback) => {
        database.getAll((err, data) => {
            if (err) {
                callback(err, null)
            } else {
                console.log(data)
                callback(null, {
                    message: `Found ${data.length} users.`,
                    data: data
                })
            }
        })
    },

    getById: (userId, callback) => {
        database.getById(userId, (err, data) => {
            if (err) {
                callback(err, null)
            } else {
                console.log(data)
                callback(null, {
                    message: `Found user with id ${userId}`,
                    data: data
                })
            }
        })
    },

    deleteUser: (userId, callback) => {
        database.delete(userId, (err, data) => {
            if (err) {
                callback(err, null)
            } else {
                callback(null, {
                    message: `User deleted with id ${userId}.`,
                    data: data
                })
            }
        })
    },

    changeUser: (user, userId, callback) => {
        database.change(user, userId, (err, data) => {
            if (err) {
                callback(err, null)
            } else {
                callback(null, {
                    message: `User changed with id ${userId}.`,
                    data: data
                })
            }
        })
    }
}

module.exports = userService
