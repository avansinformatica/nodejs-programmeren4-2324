const { get } = require('../..')
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


getById: (id, callback) => {
    database.getById(id, (err, data) => {
        if (err) {
            callback(err, null)
        } else {
            callback(null, {
                message: `Found user with id ${id}.`,
                data: data
            })
        }
    })
},
update: (id, updatedUser, callback) => {
    database.update(id, updatedUser, (err, data) => {
      if (err) {
        callback(err, null);
      } else {
        if (data) {
          callback(null, {
            message: `User updated with id ${id}.`,
            data: data,
          });
        } else {
          callback(null, {
            message: `User not found with id ${id}.`,
            data: null,
          });
        }
      }
    });
  },
 
  delete: (userId, callback) => {
    database.delete(userId, (err, data) => {
      if (err) {
        callback(err, null);
      } else {
        if (data) {
          callback(null, {
            message: `User deleted with id ${userId}.`,
            data: data,
          });
        } else {
          callback(null, {
            message: `User not found with id ${userId}.`,
            data: null,
          });
        }
      }
    });
  },
};
module.exports = userService
