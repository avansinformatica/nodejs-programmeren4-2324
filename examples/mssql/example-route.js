// ./routes/route1.js
const sql = require('mssql')

const sqlQuery = `SELECT * FROM [Sporter];`

module.exports = function (req, res) {
    req.app.locals.db.query(sqlQuery, (err, recordset) => {
        if (err) {
            console.error(err)
            res.status(500).send('SERVER ERROR')
            return
        }
        res.status(200).json({ message: 'success', data: recordset })
    })
}
