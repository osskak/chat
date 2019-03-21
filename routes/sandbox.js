const request = require('request-promise');
const express = require('express');
const router = express.Router();
const path = require('path');
const url = require('url');
const config = require('../config');
const apiPath = config.get('api:path');
const host = config.get('address');
const port = config.get('port').toString();
const operations = {
    1 : {
        "name" : "getOne",
        "params" : ['id'],
        "URI" : "/single/",
        "method" : "GET",
        "label" : "Get one record"
    },

    2 : {
        "name" : "getPagination",
        "params" : ['page'],
        "URI" : "/list/",
        "method" : "GET",
        "label" : "Get ten records"
    },

    3 : {
        "name" : "add",
        "params" : ['text', 'email'],
        "URI" : "/",
        "method" : "POST",
        "label" : "Add new record"
    }
};

function getPrettyJsonFormat(data) {
    try {
        const object = typeof data === 'string' ? JSON.parse(data) : data;
        return JSON.stringify(object, null, 2);
    } catch (e) {
        return data;
    }
}

function getQuery(operation, params) {
    let que = '';

    if (operation.method === 'GET') {
        operation.params.forEach(name => {
           que += `/${params[name]}`;
        });
    }

    return que;
}

function getFormData(operation, params) {
    if (operation.method !== 'GET') {
        const form = {};

        operation.params.forEach(name => {
            form[name] = params[name];
        });

        return form;
    }

    return null;
}

/* Sandbox pages */

router.get('/', async (req, res, next) => {

    let response;
    let URL;

    if (Object.keys(req.query).length) {

        const value = req.query['selected_operation'];
        let operation = operations[value];

        if (!value || !operation) return next(`Choose operation`);

        if (!operation.params.every(key => req.query[key])) {
            return next(`Not all required parameters are entered`);
        }

        const apiUri = path.join(apiPath, operation.URI, getQuery(operation, req.query));
        URL = url.resolve(`${host}:${port}`, apiUri);

        const requestBody = {
            method: operation.method.toLowerCase(),
            url: URL,
            form: getFormData(operation, req.query)
        };

        try {
            const requestData = await request(requestBody);
            response = getPrettyJsonFormat(requestData);
        } catch (e) {
            const error = e && e.response && e.response.body ? e.response.body : e;
            response = getPrettyJsonFormat(error);
        }
    }

    res.render('sandbox', {
        title : 'Sandbox',
        response: response,
        query : req.query,
        url : URL,
        operations : operations
    });
});

module.exports = router;
