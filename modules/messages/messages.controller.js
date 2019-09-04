const MessagesService = require('./messages.service');
const { checkId, checkAuthor } = require('./validation.service');
const { response, sendError } = require('../../libs/response');
const striptags = require('striptags');
const validate = require('../../libs/validation');

class MessagesController {
    static add(req, res) {
        const text = striptags(req.body.text || '').trim();
        const email = striptags(req.body.email || '').trim();
        let { author } = req.cookies;

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

        MessagesService.add({author, text, email}, (err, data) => {
            if (err) return sendError(res, err);

            if (data && Object.keys(data).length) {
                response(res, 200, false, data);
            } else {
                response(res, 500, 'Internal Server Error', null);
            }
        });
    }

    static get(req, res) {
        const { id } = req.params;

        if (!checkId(id)) {
            return response(res, 404, 'Not found', null);
        }

        MessagesService.get(id, (err, data) => {
            if (err) return sendError(res, err);

            if (data && Object.keys(data).length) {
                response(res, 200, false, data);
            } else {
                response(res, 404, 'Not found', null);
            }
        });
    }

    static getList(req, res) {
        let { page } = req.params;
        page = isNaN(page) ? 0 : parseInt(page, 10);

        MessagesService.getList(page, (err, data) => {
            if (err) return sendError(res, err);

            if (data && data.length) {
                response(res, 200, false, data);
            } else {
                response(res, 404, 'Not found', null);
            }
        });
    }
}

module.exports = MessagesController;
