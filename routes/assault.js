var express = require('express');
var func = require('./func');
var router = express.Router();
let db = require('../db');

/* GET assault listing. */
router.get('/', function(req, res) {
  res.render('assault',{'error' : req.session.errorAssault});
});

router.post('/', function(req,res) {
  if (typeof req.body.powerAssault === 'string' || req.body.powerAssault instanceof String) {

    //On mets la puissance de l'assaut sélectionné dans une variable de session
    //Pour paramétrer le bouton "Retenter l'assaut" dans /character
    req.session.powerAssault = req.body.powerAssault

    let deltaLight = req.body.powerAssault - req.session.lightCharacter;
    let pourcentWin = 1;
    let bonusLight = 0

    //Détermine le bonus de lumière sur le loot final
    //Plus la prise de risque est grosse, plus le bonus est important
    //PLus la prise de risque est grosse, plus il est difficile de réussir
    if (deltaLight >= 150) {
      pourcentWin = 0.2;
      bonusLight = 20
    } else if (deltaLight >= 100 ) {
      pourcentWin = 0.4;
      bonusLight = 15
    } else if (deltaLight >= 50) {
      pourcentWin = 0.6;
      bonusLight = 10
    } else if (deltaLight >= 0) {
      pourcentWin = 0.8;
      bonusLight = 5
    } else if (deltaLight < 0) {
      //-20 pour éviter l'abus d'assaut à faible puissance
      bonusLight = -20
    }

    req.session.advertInventory = false;

    var randValue = Math.random()

    if (randValue < pourcentWin) {
      req.session.win = true;

      //Récupération de tous les items
      let randomLoot = "SELECT json FROM DestinyInventoryItemDefinition";
      db.all(randomLoot, [], (err, rows) => {
        if (err) {
          return console.error(err.message);
        }

        let typeEquipment = ["item_type.weapon", "armor_type.head" , "armor_type.arms", "armor_type.chest", "armor_type.legs", "armor_type.class"];
        let tabRowsLoot = func.parseJsonToSQLite(rows);
        let randomId = 0;
        let equipmentOK = false;

        //On vérifie que l'item random qu'on va choisir peut être équipé
        //Dans destiny il y plein de type d'item
        //Ici on veut seulement les armes et les armures
        while (!equipmentOK) {
          randomId = func.getRandomInt(tabRowsLoot.length)

          if (tabRowsLoot[randomId].traitIds) {
            tabRowsLoot[randomId].traitIds.forEach( e => {
              if (typeEquipment.includes(e)) {
                equipmentOK = true;
              }
            })
          }

        }

        let loot = tabRowsLoot[randomId]

        let type = ''
        switch (loot.itemCategoryHashes[0]) {
          case 2:
          type = 'Cinétique'
          break;
          case 3:
          type = 'Énergétique'
          break;
          case 4:
          type = 'Puissante'
          break;
          default:
          type = loot.traitIds[0]
        }

        //On vérifie qu'il reste de la place dans l'inventaire
        let queryVerifPlaceInventory = "SELECT * FROM DestinyEquipment WHERE IDCharacter = ? AND TypeEquipment LIKE ?"
        db.all(queryVerifPlaceInventory, [req.session.idCharacter,type], (err, rows) => {
          if (err) {
            return console.error(err.message);
          }

          //Si + de 5 équipement, on le supprime
          if (rows.length >= 5) {
            req.session.advertInventory = true
            res.redirect('/character')
          } else {
            let insertArrayLoot = []

            let min = req.session.lightCharacter - 5
            let max = req.session.lightCharacter + 20
            //On randomise la puissance de l'item tout en étant proche
            //de la puissance actuelle du personnage
            let lightLoot = Math.floor(Math.random() * (max - min + 1)) + min;

            //La puissance est bloqué à 1300
            if (lightLoot > 1300) {
              lightLoot = 1300
            }

            insertArrayLoot.push(loot.hash >> 32)
            insertArrayLoot.push(loot.displayProperties.name)
            insertArrayLoot.push(lightLoot + bonusLight)
            insertArrayLoot.push(type)
            insertArrayLoot.push(loot.displayProperties.icon)
            insertArrayLoot.push(false)
            insertArrayLoot.push(req.session.idCharacter)

            let insertLoot = "INSERT INTO DestinyEquipment (HashEquipment, NameEquipment, LightEquipment, TypeEquipment, UrlImgEquipment, IsEquipped, IDCharacter) VALUES (?, ?, ?, ?, ?, ?, ?)"
            db.run(insertLoot,insertArrayLoot.flat(), function(err) {
              req.session.newItem = this.lastID
              res.redirect('/character')
            })

          }

        })

      });

    } else {
      console.log('b');
      req.session.win = false;
      res.redirect('/character')
    }


  } else {
    req.session.errorAssault = 'Veuillez remplir les champs'
    res.redirect('/assault')
  }

})

module.exports = router;
