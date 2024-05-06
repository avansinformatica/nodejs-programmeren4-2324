//
// Onze lokale 'in memory database'.
// We simuleren een asynchrone database met een array van objecten.
// De array bevat een aantal dummy records.
// De database heeft twee methoden: get en add.
// Opdracht: Voeg de overige methoden toe.
//
const database = {
    // Het array met dummy records. Dit is de 'database'.
    _data: [
        {
            id: 0,
            firstName: 'Hendrik',
            lastName: 'van Dam',
            emailAdress: 'hvd@server.nl'
            // Andere velden uit het functioneel ontwerp
        },
        {
            id: 1,
            firstName: 'Marieke',
            lastName: 'Jansen',
            emailAdress: 'm@server.nl'
            // Andere velden uit het functioneel ontwerp
        }
    ],

    // Ieder nieuw item in de database krijgt 'autoincrement' index.
    // Voeg een index toe aan elk nieuw item.
    _index: 2,
    _delayTime: 500,

    getAll(callback) {
        // Simuleer een asynchrone operatie
        setTimeout(() => {
            callback(null, this._data);
        }, this._delayTime);
    },

    getById(id, callback) {
        // Simuleer een asynchrone operatie
        setTimeout(() => {
            const user = this._data.find((item) => item.id === id);
            if (!user) {
                callback({ message: `Error: id ${id} does not exist!` }, null);
            } else {
                callback(null, user);
            }
        }, this._delayTime);
    },

    add(item, callback) {
        // Simuleer een asynchrone operatie
        setTimeout(() => {
            const emailExists = this._data.some((user) => user.emailAdress === item.emailAdress);
            if (emailExists) {
                callback({ message: `Error: email ${item.emailAdress} already exists!` }, null);
            } else {
                item.id = this._index++;
                this._data.push(item);
                callback(null, item);
            }
        }, this._delayTime);
    },

    update(id, updatedFields, callback) {
        // Simuleer een asynchrone operatie
        setTimeout(() => {
            const index = this._data.findIndex((item) => item.id === id);
            if (index === -1) {
                callback({ message: `Error: id ${id} does not exist!` }, null);
            } else {
                // Update de velden van het bestaande record
                this._data[index] = { ...this._data[index], ...updatedFields };
                callback(null, this._data[index]);
            }
        }, this._delayTime);
    },

    delete(id, callback) {
        // Simuleer een asynchrone operatie
        setTimeout(() => {
            const index = this._data.findIndex((item) => item.id === id);
            if (index === -1) {
                callback({ message: `Error: id ${id} does not exist!` }, null);
            } else {
                const [deletedItem] = this._data.splice(index, 1);
                callback(null, deletedItem);
            }
        }, this._delayTime);
    }
};

module.exports = database;
