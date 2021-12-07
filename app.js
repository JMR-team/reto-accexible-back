const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

// Use dot env to load the .env file
require('dotenv').config()

// Load the routers
const usersRouter = require('./routes/users');

// Declare and init the app instance
const app = express();

// Cors conffiguration
app.use(cors())

// Print logs of requests in the console
app.use(logger('dev'));

// Parse the JSON and url encoded body of the urls
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Parse cookies
app.use(cookieParser());

// Mount the routers in the app
app.use('/users', usersRouter);

module.exports = app;
