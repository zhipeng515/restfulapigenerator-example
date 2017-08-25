'use strict';
const Joi = require('joi');
const mainDB = require('../database').mainDB;
const apiInfo = require('restfulapigenerator').apiInfo;
const Boom = require('boom');
const  _ = require('lodash');

module.exports = {

    info:{
        name:'Question',
        version:'0.0.1'
    },

    db:mainDB,

    Schema:{
        difficulty:   { type: Number, required: true, joi: Joi.number() },
        count:  { type: Number, required: true, joi: Joi.number() },
        word:  { type: String, required: true, joi: Joi.string() },
        noiseword:  { type: Array, required: true, joi: Joi.array().items(Joi.string()) },
        rand:  { type: Number, index: true, /*default: Math.random(),*/ joi: Joi.number() },
    },

    Options: {
        routes: {
            getAll: {
                disable: false
            },
            getOne: {
                disable: true
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
            create: {
                handler: function (request, reply) {
                    var payload = request.payload;
                    var object = new apiInfo.Question.model(payload);
                    object.rand = Math.random();
                    object.save(function (err, data) {
                        if (!err) {
                            reply({id: data.id}).created('/' + data.id); // HTTP 201
                        } else {
                            if (11000 === err.code || 11001 === err.code) {
                                reply(Boom.forbidden('please provide another quest id, it already exist'));
                            } else {
                                reply(Boom.forbidden(getErrorMessageFrom(err))); // HTTP 403
                            }
                        }
                    });
                }
            },
            getAll: {
                validate: {
                    query: {
                        pageSize: Joi.number().integer().min(3).max(3).default(3),
                    }
                },
               handler: function(request, reply){
                   var pageSize = request.query.pageSize || 3;
                   var lastId = request.query.lastId || Number.MAX_VALUE;
                   var filter = apiInfo.Question.responses.getAll.filter;
                   var conditionGT = {
                       id: {$lt: Number.MAX_VALUE},
                       deleted: {$ne: true},
                       rand: {$gt: Math.random()}
                   };
                   apiInfo.Question.model.findAll(lastId, pageSize, filter, conditionGT).then(
                       function (data) {
                           if (_.isEmpty(data)) {

                               var conditionLT = {
                                   id: {$lt: Number.MAX_VALUE},
                                   deleted: {$ne: true},
                                   rand: {$lt: Math.random()}
                               };

                               apiInfo.Question.model.findAll(lastId, pageSize, filter, conditionLT).then(
                                   function (data) {
                                       if (_.isEmpty(data)) {
                                           reply(Boom.notFound('Cannot find any question'));
                                       } else {
                                           reply(data);
                                       }
                                   },
                                   function (error) {
                                       if (error) {
                                           reply(Boom.badImplementation(err)); // 500 error
                                       }
                                   }
                               );
                           } else {
                               reply(data);
                           }
                       },
                       function (error) {
                           if (error) {
                               reply(Boom.badImplementation(err)); // 500 error
                           }
                       }
                   );
               }
            }
        }
    }
};