var express = require('express');
var func = require('./func');
var router = express.Router();
let db = require('../db');

router.get('/:id/:type', function (req, res, next) {
  let idItem = req.params.id
  let typeItem = req.params.type
  //Réinitialisation des variables sessions pour éviter le/les Toast réapparaisse "
  req.session.advertInventory = null;
  req.session.win = null;
  req.session.newItem = null;

  //On enlève l'item équipé
  let unequipItem = "UPDATE DestinyEquipment SET IsEquipped = 0 WHERE IsEquipped = 1 AND TypeEquipment LIKE ? AND IDCharacter = ?";
  db.run(unequipItem, [typeItem,req.session.idCharacter] , err => {
    console.log('1err ' + err);

    //On équiple l'item souhaité
    let equipNewItem = "UPDATE DestinyEquipment SET IsEquipped = 1 WHERE (IDEquipment = ?)";
    db.run(equipNewItem, idItem , err => {

      //On select tous les équipement équipés pour faire la moyenne de puissance
      let selectAllEquiped = "SELECT * FROM DestinyEquipment WHERE IsEquipped = 1 AND IDCharacter = ?"
      db.all(selectAllEquiped, req.session.idCharacter , (err,rows) => {

        let tabVal = []
        rows.forEach(e => {
          tabVal.push(e.LightEquipment)
        })

        let averageLight = func.numAverage(tabVal)
        //Dans destiny la moyenne est arrondie à l'inférieur
        averageLight = Math.trunc(averageLight)

        //On update la lumière du personnage
        let updateLight = "UPDATE DestinyCharacter SET LightCharacter = ? WHERE (IDCharacter = ?)"
        db.run(updateLight, [averageLight,req.session.idCharacter] , err => {
          req.session.lightCharacter = averageLight

          res.redirect("/character");
        })

      });

    });

  });
})

module.exports = router;
