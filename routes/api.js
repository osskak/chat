const express = require('express');
const router = express.Router();
const MessagesController = require('../modules/messages/messages.controller');

/* API pages */

// get messages (10 on page)
router.get('/list/:page', (req, res) => {
    MessagesController.getList(req, res);
});

// get single message
router.get('/single/:id', (req, res) => {
    MessagesController.get(req, res);
});

// create message
router.post('/', (req, res) => {
    MessagesController.add(req, res);
});

module.exports = router;
