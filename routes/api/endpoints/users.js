// 3rd party packages
const ObjectID = require('mongodb').ObjectId;

// Router
const router = require('express').Router();

const userSerializer = ({ password, _id, ...user }) => user;

// GET method for obtaining user info
router.get('/', (req, res) => {
    const { user } = req;
    return res.json(userSerializer(user));
});

// export the router
module.exports = router;
