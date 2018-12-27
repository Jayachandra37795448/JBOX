var bodyParser = require('body-parser');
var helmet = require('helmet');
var express = require('express');
var logger = require('morgan');
var HttpError = require('http-errors');
var apiErrorHandler = require('api-error-handler');
var cors = require('cors');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

//import your routes
var routes = require('./routes/index');

//initiate the application
var app = express();

//start middleware
//CORS enable
app.use(cors());
app.get('/api/routes', function (req, res) {
    res.json({msg: 'This is CORS-enabled for all origins!'})
});
app.use(cors());
//logging
app.use(logger('combined'));
//security
app.use(helmet.hidePoweredBy());
//json body parser
app.use(bodyParser());
app.use(bodyParser.json());

//prefix all calls with /api
app.use('/api', routes);

//response handling
app.use((req, res, next) => {
    //http_error library handling
    next(new HttpError.NotFound())
});

app.use(apiErrorHandler());

module.exports = app;
