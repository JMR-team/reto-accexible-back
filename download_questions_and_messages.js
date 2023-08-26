// const db = require('./db');
const { MongoClient } = require('mongodb');
const fs = require('fs/promises');

(async () => {
    const { MONGODB_CONNECTION_STRING } = process.env;

    const connectionString = MONGODB_CONNECTION_STRING;

    const client = new MongoClient(connectionString);

    await client.connect();
    let db = client.db('accexible');
    const collectionsData = await Promise.all(
        ['chatbotMessages', 'testQuestions'].map(async (collection) => {
            const docs = await db.collection(collection).find({}).toArray();
            return { collection, docs };
        })
    );
    await client.close();

    collectionsData.forEach(({ docs, collection }) => {
        fs.writeFile(`./${collection}.json`, JSON.stringify(docs));
    });
})();
