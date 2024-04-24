//
// Onze lokale 'in memory database'.
// We simuleren een asynchrone database met een array van objecten.
// De array bevat een aantal dummy records.
// De database heeft twee methoden: get en add.
// Opdracht: Voeg de overige methoden toe.
//
const assert = require('assert')

const database = {
    // het array met dummy records. Dit is de 'database'.
    _data: [
        {
            id: 0,
            firstName: 'Hendrik',
            lastName: 'van Dam',
            emailAdress: 'hvd@server.nl'
            // Hier de overige velden uit het functioneel ontwerp
        },
        {
            id: 1,
            firstName: 'Marieke',
            lastName: 'Jansen',
            emailAdress: 'm@server.nl'
            // Hier de overige velden uit het functioneel ontwerp
        }
    ],

    // Ieder nieuw item in db krijgt 'autoincrement' index.
    // Je moet die wel zelf toevoegen aan ieder nieuw item.
    _index: 2,
    _delayTime: 500,

    getAll(callback) {
        // Simuleer een asynchrone operatie
        setTimeout(() => {
            // Roep de callback aan, en retourneer de data
            callback(null, this._data)
        }, this._delayTime)
    },

    getById(userId, callback) {
        // Simuleer een asynchrone operatie
        setTimeout(() => {
            // if (userId < 0 || userId >= this._data.length) {
            //     callback(
            //         { message: `Error: id ${userId} does not exist!` },
            //         null
            //     )
            // } else {
            //     callback(null, this._data[userId])
            // }
            // callback(null, this._data[id])
            try {
                console.log('UserID: ' + userId)
                assert.ok(
                    this.checkIfIDExists(userId),
                    'This ID does not exist'
                )
                console.log('userId: ' + userId)
                let arrayPosition = this.getArrayPositionOfUserID(userId)

                callback(null, this._data[arrayPosition])
            } catch (error) {
                console.error(error)
                callback(error)
            }
        }, this._delayTime)
    },

    add(item, callback) {
        // Simuleer een asynchrone operatie
        setTimeout(() => {
            try {
                assert.ok(
                    !this.checkIfEmailExists(item.emailAdress),
                    'An user with this emailaddress already exists'
                )
                // Proceed with your logic here
                // Add an id and add the item to the database
                item.id = this._index++
                // Add item to the array
                this._data.push(item)
                // Call the callback at the end of the operation
                // with the added item as argument, or null if an error occurred
                callback(null, item)
            } catch (error) {
                console.error(error)
                callback(error)
            }
        }, this._delayTime)
    },

    // Voeg zelf de overige database functionaliteit toe
    delete(userId, callback) {
        // Simuleer een asynchrone operatie
        setTimeout(() => {
            if (userId < 0 || userId >= this._data.length) {
                callback(
                    { message: `Error: id ${userId} does not exist!` },
                    null
                )
            } else {
                this._data.splice(userId, 1)
                callback(null, userId)
            }
        }, this._delayTime)
    },

    change(item, userId, callback) {
        // Simuleer een asynchrone operatie
        setTimeout(() => {
            this._data[userId] = item

            // Roep de callback aan het einde van de operatie
            // met het toegevoegde item als argument, of null als er een fout is opgetreden
            callback(null, item)
        }, this._delayTime)
    },

    checkIfEmailExists(emailAdress) {
        for (let i = 0; i < this._data.length; i++) {
            if (this._data[i].emailAdress === emailAdress) {
                console.log('entered if loop in checkIfEmailExists')
                console.log('userId in if loop: ' + this._data[i].id)
                return true
            }
        }
        return false
    },

    checkIfIDExists(parameterID) {
        console.log('UserID in checkIfIDExists: ' + parameterID)
        for (let i = 0; i < this._data.length; i++) {
            console.log(
                'arrayID: ' +
                    this._data[i].id +
                    ' and parameterID: ' +
                    parameterID
            )
            console.log('typeof parameterID: ' + typeof parameterID)
            if (this._data[i].id === parameterID) {
                console.log('entered if loop in checkIfIDExists')
                return true
            }
        }
        return false
    },

    getArrayPositionOfUserID(id) {
        let arrayPosition = 0
        for (let i = 0; i < this._data.length; i++) {
            console.log('entered for loop')
            console.log(i)
            console.log(this._data[i].id)
            if (this._data[i].id === id) {
                console.log('entered if loop')
                arrayPosition = i
            }
        }
        return arrayPosition
    }
}

module.exports = database
// module.exports = database.index;
