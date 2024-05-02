//
// Application configuration
//
const secretkey = process.env.SECRETKEY || 'DitIsEenGeheim'

const config = {
    secretkey: secretkey,

    dbHost: 'localhost',
    dbUser: 'app_user',
    dbDatabase: 'database_name'
}

module.exports = config
