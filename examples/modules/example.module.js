/**
 * Dit is een voorbeeldbestand waarin een module wordt gedefinieerd.
 * De module wordt in het bestand index.module.js required en gebruikt.
 *
 */

const exampleModule = {
    // Hier komen alle attributen en functies van de module te staan

    // Attributen
    name: 'Example module',
    version: '0.0.1',

    // Functies
    // Deze functie geeft een bericht terug en gebruikt de attributen van de module
    getMessage: () => {
        return 'Hello from ' + exampleModule.name + ' v' + exampleModule.version
    },

    // Deze functie geeft een bericht terug met een naam
    getMessageWithName: (name) => {
        return `Hello from ${name} in the example module!`
    }
}

module.exports = exampleModule
