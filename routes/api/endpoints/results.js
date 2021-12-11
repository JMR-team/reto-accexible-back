const router = require('express').Router();

router.post('/',async function (req,res) {
    res.send('This is the POST results endpoint')
})

module.exports = router;