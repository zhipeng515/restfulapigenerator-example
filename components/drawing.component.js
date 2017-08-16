'use strict';
const Joi = require('joi');
const mainDB = require('../database').mainDB;

module.exports = {

    info:{
        name:'Drawing',
        version:'0.0.1'
    },

    db:mainDB,

    Schema:{
        userid:  { type: Number, required: true, index: true, joi: Joi.number(),
            join: {
                path: 'user',
                bind: {
                    ref: 'User',
                    localField: 'userid',
                    foreignField: 'id',
                    justOnce: true
                },
                select: 'nickname avatar -_id'
            }
        },
        title:   { type: String, required: true, joi: Joi.string() },
        answer:  { type: String, required: true, joi: Joi.string() },
        options: { type: Array, required: true, validated: false, joi: Joi.array().items(Joi.string()) },
        strokeUrl:  { type: String, required: true, joi: Joi.string() },
    },

    Options: {
        routes: {
            getAll: {
                disable: false
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
            }
        },
        controllers:{
            getAll: {
                validate: {
                    query: {
                        lastId: Joi.number().integer().description('The last id, from lastest drawing with an unspecified value'),
                        pageSize: Joi.number().integer().min(1).max(100).default(20).description('The number of drawing per pages(1-100), default value is 20'),
                        userid: Joi.string().required().description('The user id')
                    }
                },
                condition: function (request) {
                    return {
                        id: {$lt: Number.MAX_VALUE},
                        deleted: {$ne: true},
                        userid: request.query.userid
                    };
                }
            }
        }
    }
};