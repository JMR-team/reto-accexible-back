// const db = require('./db');
const { MongoClient, ObjectId } = require('mongodb');
const fs = require('fs/promises');
const path = require('path');
require('dotenv').config();

const { MONGODB_CONNECTION_STRING } = process.env;

const connectionString = MONGODB_CONNECTION_STRING;

const client = new MongoClient(connectionString);

(async () => {
    const directoryPath = path.dirname(__filename);
    const targetExtension = '.json';
    const allFilesInDirectory = await fs.readdir(directoryPath);

    const matchingJsonFiles = allFilesInDirectory.filter(
        (file) => path.extname(file) === targetExtension
    );

    await client.connect();
    let db = client.db('accexible');
    await Promise.all(
        matchingJsonFiles.map(async (file) => {
            const [collectionName] = path.basename(file).split('.');
            const fullPathToFile = path.resolve(directoryPath, file);
            const data = JSON.parse(await fs.readFile(fullPathToFile));
            const docs = data.map(({ _id, ...data }) => ({
                _id: new ObjectId(_id),
                ...data,
            }));
            await db.collection(collectionName).insertMany(docs);
        })
    );

    await client.close();
})();
