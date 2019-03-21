const express = require('express');
const router = express.Router();

/* Root pages */

router.get('/favicon.ico', (req, res) => res.status(204));

module.exports = router;
