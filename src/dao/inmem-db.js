//
// Onze lokale 'in memory database'.
// We simuleren een asynchrone database met een array van objecten.
// De array bevat een aantal dummy records.
// De database heeft twee methoden: get en add.
// Opdracht: Voeg de overige methoden toe.

//
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

    findUserByEmail(email, callback) {
        // Simulate an asynchronous operation
        setTimeout(() => {
            const user = this._data.find((item) => item.emailAdress === email)
            if (user) {
                callback(null, user)
            } else {
                callback(null, null)
            }
        }, this._delayTime)
    },
    
    getById(id, callback) {
        // Simuleer een asynchrone operatie
        setTimeout(() => {
            if (id < 0 || id >= this._data.length) {
                callback({ message: `Error: id ${id} does not exist!` }, null)
            } else {
                callback(null, this._data[id])
            }
        }, this._delayTime)
    },

    add(item, callback) {
        // Simuleer een asynchrone operatie
        setTimeout(() => {
            // Voeg een id toe en voeg het item toe aan de database
            item.id = this._index++
            // Voeg item toe aan de array
            this._data.push(item)

            // Roep de callback aan het einde van de operatie
            // met het toegevoegde item als argument, of null als er een fout is opgetreden
            callback(null, item)
        }, this._delayTime)
    },

    // Voeg zelf de overige database functionaliteit toe
    update(id, newData, callback) {
        // Simuleer een asynchrone operatie
        setTimeout(() => {
            if (id < 0 || id >= this._data.length) {
                callback({ message: `Error: id ${id} does not exist!` }, null)
            } else {
                // Vind het item met de opgegeven id
                const item = this._data[id]

                // Update de velden met de nieuwe data
                Object.assign(item, newData)

                // Roep de callback aan het einde van de operatie
                // met het bijgewerkte item als argument, of null als er een fout is opgetreden
                callback(null, item)
            }
        }, this._delayTime)
    },

    delete(id, callback) {
        // Simulate an asynchronous operation
        setTimeout(() => {
            if (id < 0 || id >= this._data.length) {
                callback({ message: `Error: id ${id} does not exist!` }, null)
            } else {
                // Find the index of the item with the specified id
                const index = this._data.findIndex((item) => item.id === id)

                // Remove the item from the array
                const deletedItem = this._data.splice(index, 1)[0]

                // Call the callback at the end of the operation
                // with the deleted item as argument, or null if an error occurred
                callback(null, deletedItem)
            }
        }, this._delayTime)
    }
}

module.exports = database
// module.exports = database.index;
