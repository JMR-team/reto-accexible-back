const router = require('express').Router();
const bcrypt = require('bcrypt');

const generateAccessToken = require('../generateAccessToken');

router.post('/', async (req, res) => {
    // Read the new user data from the request body
    let {email,firstName,lastName,password} = req.body;

    // Insert the new user in the database
    let db = req.app.locals.db;
    let usersCollection = db.collection('users');

    usersCollection.insertOne(
        {
            email:email,
            firstName:firstName,
            lastName:lastName,
            password: bcrypt.hashSync(password,10) //Insert the encrypted password
        }
    ).then(data=>{
        // If the user was created generate a token from its db id and send the token in the response
        const token = generateAccessToken({ id: data.insertedId });
        res.json({token});
    }).catch(err=>{
        if (err.code == 11000){ // The user already exists
            res.status(409).json(
                {
                    err: `User already registered`,
                    keyValue : err.keyValue,
                }
            )
        } else {
            res.status(500).json({err:err});
        }
    });
});

module.exports = router;