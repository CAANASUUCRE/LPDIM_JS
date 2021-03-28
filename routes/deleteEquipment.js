var express = require('express');
var func = require('./func');
var router = express.Router();
let db = require('../db');

router.get('/:id', function (req, res, next) {
  let idItem = req.params.id
  //Réinitialisation des variables sessions pour éviter le/les Toast réapparaisse "
  req.session.advertInventory = null;
  req.session.win = null
  req.session.newItem = null

  let selectEquipment = 'DELETE FROM DestinyEquipment WHERE IDEquipment = ?'
  db.run(selectEquipment, idItem, err => {
    res.redirect("/character");
  });

})

module.exports = router;
