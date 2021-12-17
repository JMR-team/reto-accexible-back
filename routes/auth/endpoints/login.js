const router = require('express').Router();
const bcrypt = require('bcrypt');

const generateAccessToken = require('../generateAccessToken');

router.post('/',async (req, res) => {
    // Read the email and password from the request
    let {email,password} = req.body;
    // find the user in the database
    let db = req.app.locals.db;
    let usersCollection = db.collection('users');
    let user = await usersCollection.findOne( { email: email} );
    if (user==undefined){ //Invalid user email
        return res.status(404).json({err:'Incorrect user email'});
    } else if ( !bcrypt.compareSync(password,user.password) ) { // Valid email, but invalid password
        return res.status(403).json({err:'Incorrect password'});
    }
    const token = generateAccessToken({ id: user._id });
    return res.json({msg:'Correct login',token});
});



module.exports = router;