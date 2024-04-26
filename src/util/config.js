//
// Application configuration
//
const secretkey = process.env.SECRETKEY || 'DitIsEenGeheim'

const config = {
    user: process.env.MSSQL_DB_USER || 'username', // better stored in an app setting such as process.env.MSSQL_DB_USER
    password: process.env.MSSQL_DB_PASSWORD || 'password', // better stored in an app setting such as process.env.MSSQL_DB_PASSWORD
    server: process.env.MSSQL_DB_SERVER || 'your_server.database.windows.net', // better stored in an app setting such as process.env.MSSQL_DB_SERVER
    port: process.env.MSSQL_DB_PORT || 1433, // optional, defaults to 1433, better stored in an app setting such as process.env.MSSQL_DB_PORT
    database: process.env.MSSQL_DB_DATABASE || 'AdventureWorksLT', // better stored in an app setting such as process.env.MSSQL_DB_NAME
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    },
    authentication: {
        type: 'default'
    },
    options: {
        encrypt: true
    },
    parseJson: true
}

module.exports = { config, secretkey }
