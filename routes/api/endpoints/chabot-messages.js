const { Router } = require('express');
const db = require('../../../db');

const router = Router();

router.get('/', async function (req, res) {
    // Return an array of messages to the frontend
    let chatBotMessages = [];

    // Obtain a random message of type greeting
    let greetingMessage = await db
        .collection('chatbotMessages')
        .aggregate([
            { $match: { type: 'greeting' } },
            { $sample: { size: 1 } },
            { $project: { _id: false } },
        ])
        .toArray();
    chatBotMessages.push(...greetingMessage);

    // obtain a random question for every step of the conversation
    let distinctPositions = (
        await db.collection('chatbotMessages').distinct('index')
    ).sort((a, b) => a - b);
    for (let position of distinctPositions) {
        let question = await db
            .collection('chatbotMessages')
            .aggregate([
                { $match: { type: 'question', index: position } },
                { $sample: { size: 1 } },
                { $project: { _id: false } },
            ])
            .toArray();
        chatBotMessages.push(...question);
    }
    res.json(chatBotMessages);
});

module.exports = router;
