'use strict';
module.exports = {
    product: {
        name: 'PaintGuessAR API'
    },
    server: {
        host: 'localhost',
        port: process.env.NODE_API_PORT
    },
    database: {
        host: process.env.NODE_DB_HOST,
        port: process.env.NODE_DB_PORT,
        db: process.env.NODE_DB_SV,
        username: process.env.NODE_DB_SV_USER,
        password: process.env.NODE_DB_SV_PASS
    },
    log: {
        host: process.env.NODE_DB_HOST,
        port: process.env.NODE_DB_PORT,
        db: process.env.NODE_DB_L,
        username: process.env.NODE_DB_L_USER,
        password: process.env.NODE_DB_L_PASS
    },
    cacheOptions: {
        cache: true,
        expires: 60,
        prefix: 'RedisCache'
    },
    redis: {
        host: process.env.NODE_DB_HOST,
        port: process.env.NODE_REDIS_PORT
    },
    scopes: [
        'admin',
        'user'
    ],
    security: {
        workFactor: 11
    },
    token: {
        privateKey: process.env.NODE_API_PRIVATE_KEY,
        tokenExpire: 60 * 60 * 24 // 1 day
    }
};