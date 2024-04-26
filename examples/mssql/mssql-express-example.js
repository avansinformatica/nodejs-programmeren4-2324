/**
 * This example demonstrates how to use the mssql module with express.
 *
 * https://www.npmjs.com/package/mssql#connection-pools
 *
 */
const express = require('express')
const sql = require('mssql')
const config = require('../../src/util/config').config

// instantiate a connection pool
const appPool = new sql.ConnectionPool(config)

// require route handlers and use the same connection pool everywhere
const example_route = require('./example-route')
const app = express()

app.get('/', example_route)

//connect the pool and start the web server when done
appPool.connect(function (err, pool) {
    if (err) {
        console.error(err.code, err.message)
    }
    if (pool) {
        console.log('Connected to pool.')
        app.locals.db = pool
        const server = app.listen(3000, function () {
            const host = server.address().address
            const port = server.address().port
            console.log('Example app listening at http://%s:%s', host, port)
        })
    }
})
