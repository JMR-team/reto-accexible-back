const { MongoClient } = require('mongodb');

const { MONGODB_CONNECTION_STRING } = process.env;

const connectionString = MONGODB_CONNECTION_STRING;

const client = new MongoClient(connectionString);
client.connect();

let db = client.db('accexible');

module.exports = db;
