const router = require('express').Router();

// Import the login and signup routers
const loginRouter  = require('./endpoints/login'); 
const signupRouter = require('./endpoints/signup');

// Mount the routes
router.use('/login',loginRouter);
router.use('/signup',signupRouter);

module.exports = router;
