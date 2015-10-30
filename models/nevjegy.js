var Waterline = require('waterline');

module.exports = Waterline.Collection.extend({
    migrate: 'safe',
    identity: 'nevjegy',
    connection: 'disk',
    attributes: {
        datum: {
            type: 'date',
            defaultsTo: function () { return new Date();}
        },
        nev: 'string',
        foglalkozas: 'string',
        telefonszam: 'string',
        kesz: {
            type: 'boolean',
            defaultsTo: false
        },
        user: {
            model: 'user'
        }
    }
});