const express = require('express');
const router = express.Router();
const mongoose = require('../libs/mongoose');
const Message = require('../models/message');
const striptags = require('striptags');
const validate = require('../libs/validation');
const response = (response, statusCode, error, data) => {
    response.status(statusCode);
    response.json({
        'success' : statusCode >= 200 && statusCode <= 299,
        'error' : error,
        'data' : data
    });
};
const sendError = (res, err) => {
    console.error(err);
    return response(res, 500, 'Internal Server Error', null);
};
const checkId = id => id && /^[a-z0-9]+$/.test(id) && mongoose.Types.ObjectId.isValid(id);
const checkAuthor = author => author && /^User_\d{7}$/.test(author);
const limit = 10;

/* API pages */

// get messages (10 on page)
router.get('/list/:page', (req, res, next) => {
    let {page} = req.params;
    page = isNaN(page) ? 0 : parseInt(page, 10);

    Message.find()
        .sort('-id')
        .skip(page * limit)
        .limit(limit)
        .exec((err, data) => {
            if (err) return sendError(res, err);

            if (data) response(res, 200, false, data);
            else response(res, 404, 'Not found', data);
        });
});

// get single message
router.get('/single/:id', (req, res, next) => {
    const {id} = req.params;
    console.log('checkId', checkId(id));
    if (!checkId(id)) {
        return response(res, 404, 'Invalid identifier', null);
    }

    Message.findById(id, (err, message) => {
        if (err) return sendError(res, err);

        if (message) response(res, 200, false, message);
        else response(res, 404, 'Not found', message);
    });
});

// create message
router.post('/', (req, res, next) => {
    const text = striptags(req.body.text || '').trim();
    const email = striptags(req.body.email || '').trim();
    let {author} = req.cookies;

    if (!checkAuthor(author)) {
        author = `User_${Math.random().toString().substring(2, 9)}`;
        const week = 7 * 24 * 60 * 60 * 1000; // week in ms
        res.cookie('author', author, { maxAge: week, httpOnly: true, secure: true });
    }

    if (!validate('email', email)) {
        return response(res, 400, 'Invalid email.', null);
    }

    if (!validate('text', text)) {
        const error = 'Message cannot be empty or must contain no more the 100 symbols.';
        return response(res, 400, error, null);
    }

    const message = new Message({author, text, email});

    message.save((err, message) => {
        if (err) return sendError(res, err);

        if (message) response(res, 200, false, message);
        else response(res, 500, 'Internal Server Error', message);
    });
});

module.exports = router;
