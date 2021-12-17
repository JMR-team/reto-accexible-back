const router = require('express').Router();

// Import the login and signup routers

const signupRouter = require('./endpoints/signup');

// Mount the routes
router.use('/signup',signupRouter)

module.exports = router;
