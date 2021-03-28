var express = require('express');
var func = require('./func');
var router = express.Router();
let db = require('../db');

/* GET home page. */
router.get('/', function(req, res, next) {

  //on réinitialise les erreurs des pages 'enfant' pour plus qu'elles s'affichent
  req.session.errorCreate = null
  req.session.errorLog = null

  res.render('index');
});

module.exports = router;
