var express = require('express');
var router = express.Router();
let db = require('../db');

/* GET Character page. */
router.get('/', function(req, res) {
  let user = {
    nameCharacter : req.session.nameCharacter,
    classCharacter : req.session.classCharacter,
    genderCharacter : req.session.genderCharacter,
    raceCharacter : req.session.raceCharacter,
    lightCharacter : req.session.lightCharacter
  }
  let selectEquipment = 'SELECT * FROM DestinyEquipment WHERE IDCharacter = ? ORDER BY IsEquipped DESC'
  db.all(selectEquipment, req.session.idCharacter, (err, rows) => {
    if (err) {
      return console.error(err.message);
    }

    //on réinitialise les erreurs des pages 'enfant' pour plus qu'elles s'affichent
    req.session.errorAssault = null


    res.render('character', {'user':user,
                              'equipements':rows,
                              'win':req.session.win,
                              'advertInventory':req.session.advertInventory ,
                              'newItem' : req.session.newItem ,
                              'powerAssault' : req.session.powerAssault});
  });
});


module.exports = router;
