// 3rd party packages
const ObjectID = require("mongodb").ObjectId;

// Router
const router = require("express").Router();

// GET method for obtaining user info
router.get('/',(req,res)=>{
    let db = req.app.locals.db;
    db.collection('users').findOne( new ObjectID(req.userID),{projection:{_id:0,password:0}})
        .then(data=>{
            if (data!=undefined) {
                res.json(data);
            } else {
                res.sendStatus(404);
            }
        }).catch(err=>{
            res.sendStatus(500)
        })
})

// export the router
module.exports = router;