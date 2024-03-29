require("dotenv").config();
const { MongoClient } = require("mongodb");
const bcrypt = require("bcrypt");

let connectionURL = process.env.MONGODB_CONNECTION_STRING;
let userID = "64e865018f5c033746cb5c40"; // Insert userID here

const resultsNumber = 60;

const minTestScore = 2.25;
const maxTestScore = 9;

const minChatScore = 0;
const maxChatScore = 6;

const resultsArray = [];

let minDate = new Date(2021, 9, 4, 17).getTime();
let nowDate = Date.now();
let timeSpan = nowDate - minDate;

for (let i = 0; i < resultsNumber; i++) {
  let date = new Date(minDate + Math.random() * timeSpan);
  let testScore = Math.round(
    minTestScore + Math.random() * (maxTestScore - minTestScore)
  );
  let chatScore = Math.round(
    minChatScore + Math.random() * (maxChatScore - minChatScore)
  );
  resultsArray.push({
    user: bcrypt.hashSync(userID, 10),
    dateTime: new Date(date).toISOString(),
    testScore,
    chatScore,
    totalScore: chatScore + testScore,
  });
}

// console.log(resultsArray);

// Connect the app to the database. If its necessary, add indexes here
MongoClient.connect(connectionURL, function (err, client) {
  if (err !== undefined) {
    console.log(err);
  } else {
    // client.db('accexible').collection('testResults').find().toArray().then(data=>console.log(data))
    client.db("accexible").collection("testResults").insertMany(resultsArray);
  }
});

// console.log(initalDateTime);
// console.log(dayAfter);
