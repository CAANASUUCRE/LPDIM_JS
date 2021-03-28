var express = require('express');
var router = express.Router();
let db = require('../db');

/* GET login page. */
router.get('/', function(req, res, next) {
  res.render('login', {'error':req.session.errorLog})
});

router.post('/', function(req,res) {
  if ((typeof req.body.nameCharacter === 'string' || req.body.nameCharacter instanceof String)) {
      let queryVerifName = "SELECT * FROM DestinyCharacter WHERE nameCharacter = ?"
      db.all(queryVerifName, [req.body.nameCharacter], (err, rows) => {
        if (rows.length != 0) {
          req.session.idCharacter = rows[0].IDCharacter;
          req.session.nameCharacter = rows[0].NameCharacter;
          req.session.classCharacter = rows[0].ClassCharacter;
          req.session.genderCharacter = rows[0].GenderCharacter;
          req.session.raceCharacter = rows[0].RaceCharacter;
          req.session.lightCharacter = rows[0].LightCharacter;
          req.session.connected = true;
          console.log(req.session.idCharacter);
          res.redirect('/character');
        } else {
          req.session.errorLog = 'Personnage introuvable';
          res.redirect('/login')
        }

      })
  } else {

    req.session.errorLog = 'Veuillez remplir les champs.';
    res.redirect('/login')

  }
})

module.exports = router;
