const Joi = require('joi');
const mainDB = require('../database').mainDB;

module.exports = {
    info: {
        name: 'User',
        version: '0.0.1'
    },
    db: mainDB,
    Schema: {
        nickname    : { type: String, required: true, trim: true, joi: Joi.string() },
        phone       : { type: Number, required: false, joi: Joi.number() },
        sns         : { type: String, required: true, trim: true, joi: Joi.string() },
        snsid       : { type: String, required: true, trim: true, joi: Joi.string() },
        avatar      : { type: String, required: true, trim: true, joi: Joi.string() }
    },
    Options: {
        routes: {
            getAll: {
                disable: true
            },
            getOne: {
                disable: false
            },
            update: {
                disable: false
            },
            create: {
                disable: false
            },
            remove: {
                disable: true
            }
        }
    }
}
