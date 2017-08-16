'use strict';
const Joi = require('joi');
const mainDB = require('../database').mainDB;

module.exports = {

    info:{
        name:'share',
        version:'0.0.1'
    },

    db:mainDB,

    Schema:{
        title: { type: String, required: true, joi: Joi.string() },
        describe: { type: String, required: true, joi: Joi.string() },
        image: { type: String, required: true, joi: Joi.string() },
        url: { type: String, required: true, joi: Joi.string() },
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
                disable: true
            },
            create: {
                disable: false
            },
            remove: {
                disable: true
            },

        },
    },
}