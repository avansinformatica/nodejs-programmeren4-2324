//
// Application configuration
//
// Set the logging level.
const loglevel = process.env.LOGLEVEL || 'trace'

const logger = require('tracer').colorConsole({
    format: ['{{timestamp}} <{{title}}> {{file}}:{{line}} : {{message}}'],
    preprocess: function (data) {
        data.title = data.title.toUpperCase()
    },
    dateformat: 'isoUtcDateTime',
    level: loglevel
})

module.exports = logger
