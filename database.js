'use strict';
var config = require('./config');
var mongoose = require('mongoose');
var Redis = require('ioredis');
var redisClient = new Redis(config.redis.port, config.redis.host);
var MongooseRedis = require('mongoose-with-redis');
mongoose.Promise = require('bluebird');
//MongooseRedis(mongoose, redisClient, config.cacheOptions);
var mainDB = mongoose.createConnection('mongodb://'+config.database.username+':'+config.database.password+'@'+config.database.host+'/'+config.database.db);
mainDB.on('error', function() {
    console.error.bind(console, 'maindb connection error');
});
mainDB.once('open', function callback() {
    console.log('Connection with maindb succeeded');
});
module.exports.mongoose = mongoose;
module.exports.mainDB = mainDB;
module.exports.ObjectId = mongoose.Types.ObjectId;