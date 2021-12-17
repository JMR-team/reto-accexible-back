const jwt = require('jsonwebtoken');

// function to generate tokens for the registered users
// This tokens have a validity of a week.
function generateAccessToken(payload) {
    return jwt.sign(
        payload,
        process.env.JWT_SECRET_KEY,
        { expiresIn: '7d' }
    );
}

module.exports = generateAccessToken;