var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('<h1>_____HOLA MUNDO______</h1>');
});

module.exports = router;
