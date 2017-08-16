const Joi = require('joi');
const apiInfo = require('restfulapigenerator').apiInfo;
const Boom = require('boom');
const  _ = require('lodash');
const jwt = require('jsonwebtoken');

module.exports = {
    info: {
        name: 'Session',
        version: '0.0.1',
    },
    Schema: {
        "userid"      : { type: String, required: true, unique: true, trim: true, joi: Joi.string() },
        "deviceid"    : { type: String, required: true, trim: true, joi: Joi.string() },
        "token"       : { type: String, validated: false, joi: Joi.string() },
    },
    Options: {
        routes: {
            getAll: {
                disable: true
            },
            getOne: {
                disable: true
            },
            update: {
                disable: true
            },
            create: {
                description: '获取token',
                notes: '根据userid和deviceid获取token，没有则创建'
            },
            remove: {
                disable: true
            }
        },
        controllers: {
            create: {
                validate:{
                    query: {
                        userid:     Joi.string().required(),
                        deviceid:   Joi.string().required()
                    }
                },
                response: {
                    schema: {
                        token: Joi.string()
                    }
                },
                handler: function (request, reply) {
                    var query = request.query;
                    var token = jwt.sign(query, 'nihuawocai-ar');
                    apiInfo.Session.model.findByIdLean(null, {deleted: {$ne: true}, userid: query.userid}).then(
                        function (data) {
                            if (_.isEmpty(data)) {
                                query.token = token;
                                var object = new apiInfo.Session.model(query);
                                object.save(function (err, data) {
                                    if (!err) {
                                        reply({token: data.token});
                                    } else {
                                        reply(Boom.badImplementation(err));
                                    }
                                })
                            } else {
                                var session = data[0];
                                jwt.verify(session.token, 'nihuawocai-ar', function(err, decoded) {
                                    if (err) {
                                        reply(Boom.badImplementation(err));
                                    } else {
                                        if(query.deviceid != decoded.deviceid) {
                                            reply({token: 'token_error'});
                                        }
                                        else {
                                            reply({token: session.token});
                                        }
                                    }
                                });
                            }
                        },
                        function (error) {
                            if (error) {
                                reply(Boom.badImplementation(error)); // 500 error
                            }
                        }
                    );
                }
            }
        }
    }
};
