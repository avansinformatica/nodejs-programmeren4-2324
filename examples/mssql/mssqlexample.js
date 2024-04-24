const sql = require('mssql')

const config = {
    user: process.env.MSSQL_DB_USER || 'username', // better stored in an app setting such as process.env.MSSQL_DB_USER
    password: process.env.MSSQL_DB_PASSWORD || 'password', // better stored in an app setting such as process.env.MSSQL_DB_PASSWORD
    server: process.env.MSSQL_DB_SERVER || 'your_server.database.windows.net', // better stored in an app setting such as process.env.MSSQL_DB_SERVER
    port: process.env.MSSQL_DB_PORT || 1433, // optional, defaults to 1433, better stored in an app setting such as process.env.MSSQL_DB_PORT
    database: process.env.MSSQL_DB_DATABASE || 'AdventureWorksLT', // better stored in an app setting such as process.env.MSSQL_DB_NAME
    authentication: {
        type: 'default'
    },
    options: {
        encrypt: true
    }
}

/*
    //Use Azure VM Managed Identity to connect to the SQL database
    const config = {
        server: process.env["db_server"],
        port: process.env["db_port"],
        database: process.env["db_database"],
        authentication: {
            type: 'azure-active-directory-msi-vm'
        },
        options: {
            encrypt: true
        }
    }

    //Use Azure App Service Managed Identity to connect to the SQL database
    const config = {
        server: process.env["db_server"],
        port: process.env["db_port"],
        database: process.env["db_database"],
        authentication: {
            type: 'azure-active-directory-msi-app-service'
        },
        options: {
            encrypt: true
        }
    }
*/

console.log('Starting...')
connectAndQuery()

async function connectAndQuery() {
    try {
        var poolConnection = await sql.connect(config)

        console.log('Reading rows from the Table...')
        var resultSet = await poolConnection
            .request()
            .query(`SELECT * FROM [Sporter]`)

        console.log(`${resultSet.recordset.length} rows returned.`)

        // output column headers
        var columns = ''
        for (var column in resultSet.recordset.columns) {
            columns += column + ', '
        }
        console.log('%s\t', columns.substring(0, columns.length - 2))

        // ouput row contents from default record set
        resultSet.recordset.forEach((row) => {
            console.log(
                '%s\t%s\t%s\t%s\t%s\t%s',
                row.ID,
                row.Naam,
                row.Leeftijd,
                row.Sport,
                row.Club,
                row.Bedrag
            )
        })

        // close connection only when we're certain application is finished
        poolConnection.close()
    } catch (err) {
        console.error(err.message)
    }
}
