// Load the routers for each resource of the api
const testQuestionsRouter = require('./api/test-questions');

const { Router } = require("express");

// Router for the whole API
const router = Router();

// Add middleware for the api routes here

// Mount the routes here
router.use('/test-questions',testQuestionsRouter);

module.exports = router;