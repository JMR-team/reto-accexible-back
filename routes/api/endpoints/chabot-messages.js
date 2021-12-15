const { Router } = require("express");

const router = Router();

router.get('/',async function(req,res){
    let db = req.app.locals.db;
    try {
        db.collection('chatbotMessages').find(
            {},
            {projection:{_id:false}}
        ).toArray(function (err,questionsArray){
            if (err != undefined){
                return res.status(500).json(err);
            }
            res.status(200).json(questionsArray);
        })
    } catch(err) {
        res.status(500).json({
            err:'database is down'
        })
    }
})

module.exports = router;