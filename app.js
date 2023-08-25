const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");

// Use dot env to load the .env file
require("dotenv").config();

// Load the routers
const apiRouter = require("./routes/api/router");
const authRouter = require("./routes/auth/router");

// Declare and init the app instance
const app = express();

// Cors conffiguration
app.use(cors());

// Print logs of requests in the console
app.use(logger("dev"));

// Parse the JSON and url encoded body of the urls
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Parse cookies
app.use(cookieParser());

// Mount the routers in the app
app.use("/api", apiRouter);
app.use("/auth", authRouter);

// Connect the app to the database. If its necessary, add indexes here
MongoClient.connect(
  process.env.MONGODB_CONNECTION_STRING,
  {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  },
  function (err, client) {
    if (err !== undefined) {
      console.log(err);
    } else {
      let db = client.db("accexible");
      // Create an index in the users collection to avoid repeated emails
      db.collection("users").createIndex(
        {
          email: 1, // Name that the user choose for the bike
        },
        {
          name: "unique_email", //name of the index, not the same name as above
          unique: true,
        }
      );
      // add the database to the app
      app.locals.db = db;
    }
  }
);

// Export the app module to be used in ./bin/www
module.exports = app;
