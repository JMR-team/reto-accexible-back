const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const { MongoClient } = require('mongodb');

// Use dot env to load the .env file
require('dotenv').config()

// Load the routers
const apiRouter = require('./routes/api-router');

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
app.use('/api', apiRouter);

// Connect the app to the database. If its necessary, add indexes here
MongoClient.connect( process.env.MONGODB_CONNECTION_STRING || 'mongodb://127.0.0.1:27017' , function(err, client) {
  if(err!==undefined) {
    console.log(err);
  } else {
    // let db = client.db('accexible');
    app.locals.db = client.db('accexible');
  }
});

// Export the app module to be used in ./bin/www
module.exports = app;
