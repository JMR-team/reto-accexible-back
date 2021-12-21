const jwt = require('jsonwebtoken')

// Authenticate registered users for accesing personal data
function authenticateUserDataAccess(req, res, next) {
  // Read the jwt token from the request
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  // Verify the token and authorize users
  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decodedToken) => {
    // token is invalid. Stop the request and response with forbidden error code
    if (err != undefined) return res.status(403).send(err);
    // For valid tokens continue with the middleware chain
    req.userID = decodedToken.id;
    next();
  });
}


// Exports of the module
module.exports = {
    authenticateUserDataAccess
}
