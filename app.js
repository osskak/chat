const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const config = require('./config');
const isProd = process.env.NODE_ENV === 'production';

const indexRouter = require('./routes/index');
const apiRouter = require('./routes/api');
const sandboxRouter = require('./routes/sandbox');

const app = express();

app.set('port', config.get('port'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger(isProd ? 'combined' : 'dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/sandbox', sandboxRouter);
app.use('/api/messages', apiRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    console.error('Error handler', err);

    // convert err to object
    if (typeof err === 'string') {
        const message = err;
        err = {};
        err.message = message;
        err.status = 500;
    }

    // render the error page
    res.status(err.status || 500);
    res.render('error', {
        message : err.message || 'Error',
        error : err,
    });
});

// catch uncaughtException
process.on('uncaughtException', (err) => {
    console.error('uncaughtException', err);
    process.exit(1);
});

module.exports = app;
