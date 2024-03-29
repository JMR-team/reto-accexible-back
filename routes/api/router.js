// Load the routers for each resource of the api
const testQuestionsRouter = require('./endpoints/test-questions');
const chabotQuestionsRouter = require('./endpoints/chabot-messages');
const resultsRouter = require('./endpoints/results');
const usersRouter   = require('./endpoints/users');
const {authenticateUserDataAccess} = require('./middleware/authentication.js')

const { Router } = require("express");

// Router for the whole API
const router = Router();

// Add middleware for the api routes here
['/results','/users'].forEach( path => router.get(path,authenticateUserDataAccess) )


// Mount the routes here
router.use('/test-questions',testQuestionsRouter);
router.use('/chatbot-messages',chabotQuestionsRouter);
router.use('/results',resultsRouter);
router.use('/users',usersRouter);

module.exports = router;