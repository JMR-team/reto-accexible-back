const jwt = require('jsonwebtoken');
const db = require('../../../db');
const { ObjectId } = require('mongodb');

// Authenticate registered users for accesing personal data
function authenticateUserDataAccess(req, res, next) {
    // Read the jwt token from the request
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    // Verify the token and authorize users
    jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, decodedToken) => {
        // token is invalid. Stop the request and response with forbidden error code
        if (err != undefined) return res.status(403).send(err);
        // For valid tokens continue with the middleware chain
        const { id } = decodedToken;
        const user = await db.collection('users').findOne(new ObjectId(id));
        // req = { ...req, userID: id, user };
        req.userID = decodedToken.id;
        req.user = user;
        next();
    });
}

// Exports of the module
module.exports = {
    authenticateUserDataAccess,
};
