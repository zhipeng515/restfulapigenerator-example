const Joi = require('joi');
const mainDB = require('../database').mainDB;

module.exports = {
    info: {
        name: 'Game',
        version: '0.0.1'
    },
    db: mainDB,
    Schema: {
        userid        : { type: Number, required: true, index: true, joi: Joi.number() },
        opponentid    : { type: Number, required: true, joi: Joi.number(),
            join: {
                path: 'opponent',
                bind: {
                    ref: 'User',
                    localField: 'opponentid',
                    foreignField: 'id',
                    justOnce: true
                },
                select: 'nickname avatar -_id'
            }
        },
        round         : { type: Number, required: true, joi: Joi.number() },
        turn          : { type: Number, required: true, joi: Joi.number() },
        drawingid     : { type: Number, required: true, joi: Joi.number(),
            join: {
                path: 'drawing',
                bind: {
                    ref: 'Drawing',
                    localField: 'drawingid',
                    foreignField: 'id',
                    justOnce: true
                },
                select: 'title answer options -_id'
            }
        }
    },
    Options: {
        controllers: {
            update: {
                validate: {
                    params: {
                        id: Joi.number().required()
                    },
                    payload: {
                        round: Joi.number().required(),
                        turn: Joi.number().required(),
                        drawingid: Joi.number().required()
                    }
                }
            },
            getAll: {
                validate:{
                    query: {
                        userid: Joi.string().required().description('The user id')
                    }
                },
                condition: function(request) {
                    return {
                        id: {$lt:  Number.MAX_VALUE},
                        deleted: {$ne: true},
                        userid: request.query.userid
                    };
                }
            }
        }
    }
}
