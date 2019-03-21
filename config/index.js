'use strict';

const nconf = require('nconf');
const path = require('path');

if (process.env.NODE_ENV) {
    console.log('process.env.NODE_ENV', process.env.NODE_ENV);
}

nconf
    .argv()
    .env()
    .file({
        file: path.join(__dirname, 'config.json')
    });

module.exports = nconf;