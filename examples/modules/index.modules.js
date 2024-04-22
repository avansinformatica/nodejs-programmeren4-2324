/**
 * Dit is een voorbeeld van een bestand dat via een module informatie
 * uit een ander bestand gebruikt.
 */

// Hier wordt de module example.module.js required/imported
const myModule = require('./example.module')

// Hier worden functies uit de externe module aangeroepen
console.log(myModule.getMessage())
console.log(myModule.getMessageWithName('Marieke'))
