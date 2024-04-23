const database = require('../dao/inmem-db')


const userService = {
    create: (user, callback) => {
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
                    message: `Found ${data} users.`,
                    data: data
                })
            }
        })
    },

    // update
    update(userId, updatedUser, callback) {
        database.update(userId, updatedUser, (err, data) => {
            if (err) {
                callback(err, null);
            } else {
                callback(null, {
                    message: `Updated user with id ${userId}`,
                    data: data
                });
            }
        });
    },
    

    // delete
    delete: (userId, callback) => {
        database.delete(userId, (err, data) => {
            if (err) {
                callback(err, null);
            } else {
                callback(null, {
                    message: `Deleted user: ${data}`,
                    data: data
                })
            }
        })
    }

}

module.exports = userService
