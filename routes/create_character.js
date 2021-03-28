var express = require('express');
var func = require('./func');
var router = express.Router();
let db = require('../db');

/* GET CreateCharacter page. */
router.get('/', function(req, res) {
  let queryGender = "SELECT json FROM DestinyGenderDefinition";
  let queryRace = "SELECT json FROM DestinyRaceDefinition"
  let queryClass = "SELECT json FROM DestinyClassDefinition"

  db.all(queryGender, [], (err, rows) => {
    if (err) {
      return console.error(err.message);
    }

    var tabRowsGender = func.parseJsonToSQLite(rows);

    db.all(queryRace, [], (err,rows) => {
      if (err) {
        return console.error(err.message);
      }


      var tabRowsRace = func.parseJsonToSQLite(rows);

      db.all(queryClass, [], (err,rows) => {
        if (err) {
          return console.error(err.message);
        }

        var tabRowsClass = func.parseJsonToSQLite(rows);

        res.render('createCharacter', {'genders':tabRowsGender,'races':tabRowsRace,'classes':tabRowsClass, 'error':req.session.errorCreate});

      })
    })
  });
});

/* POST CreateCharacter page. */
router.post('/', function(req,res) {
  if ((typeof req.body.nameCharacter === 'string' || req.body.nameCharacter instanceof String)
    &&(typeof req.body.genderCharacter === 'string' || req.body.genderCharacter instanceof String)
    &&(typeof req.body.raceCharacter === 'string' || req.body.raceCharacter instanceof String)
    &&(typeof req.body.classCharacter === 'string' || req.body.classCharacter instanceof String)) {
      let queryVerifName = "SELECT * FROM DestinyCharacter WHERE nameCharacter = ?"
      const defaultLight = 1100

      //Verification si le personnage éxiste déjà
      db.all(queryVerifName, [req.body.nameCharacter], (err, rows) => {

        if (rows.length == 0) {
          let insertCharacter = "INSERT INTO DestinyCharacter (NameCharacter,ClassCharacter, GenderCharacter, RaceCharacter, LightCharacter) VALUES (?, ?, ?, ? ,?)";
          let info = [req.body.nameCharacter, req.body.classCharacter, req.body.genderCharacter, req.body.raceCharacter, defaultLight];

          //insert d'un personnage
          db.run(insertCharacter, info, function(err) {
            //stockage des données importante dans des variables de session
            req.session.idCharacter = this.lastID;
            req.session.nameCharacter = req.body.nameCharacter;
            req.session.classCharacter = req.body.classCharacter;
            req.session.genderCharacter = req.body.genderCharacter;
            req.session.raceCharacter = req.body.raceCharacter;
            req.session.lightCharacter = defaultLight;
            req.session.connected = true;

            //les id SQLite de l'équipement par défaut
            const helmetHash = 3324158902 >> 32
            const chestplateHash = 2320951982 >> 32
            const gauntletHash = 191708423 >> 32
            const legHash = 3371366804 >> 32
            const objectClassHash = 2039043276 >> 32
            const primaryWeaponHash = 2505533224 >> 32
            const secondaryWeaponHash = 2707464805 >> 32
            const heavyWeaponHash = 3691881271 >> 32

            let selectItem = "SELECT json FROM DestinyInventoryItemDefinition WHERE id IN (?,?,?,?,?,?,?,?)";
            let hashes = [helmetHash,chestplateHash,gauntletHash,legHash,objectClassHash,primaryWeaponHash,secondaryWeaponHash,heavyWeaponHash]

            //Récupération des données de l'equipement par défaut
            db.all(selectItem, hashes, (err, rows) => {
              if (err) {
                return console.error(err.message);
              }

              let arrayEquipment = func.parseJsonToSQLite(rows);
              let insertArrayEquipment = []


              arrayEquipment.forEach(function(oneEquipment) {
                let arrayTemp = []


                arrayTemp.push(oneEquipment.hash >> 32)
                arrayTemp.push(oneEquipment.displayProperties.name)
                arrayTemp.push(defaultLight)

                //Case attribuera des types d'armes, default attribuera le type d'armure
                let type = ''
                switch (oneEquipment.itemCategoryHashes[0]) {
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
                    type = oneEquipment.traitIds[0]
                }
                arrayTemp.push(type)
                arrayTemp.push(oneEquipment.displayProperties.icon)
                arrayTemp.push(true)
                arrayTemp.push(req.session.idCharacter)
                insertArrayEquipment.push(arrayTemp)


              })
              let itemPlaceholders = insertArrayEquipment.map(() => "(?, ?, ?, ?, ?, ?, ?)").join(', ');
              let insertItems = "INSERT INTO DestinyEquipment (HashEquipment, NameEquipment, LightEquipment, TypeEquipment, UrlImgEquipment, IsEquipped, IDCharacter) VALUES " + itemPlaceholders
              db.run(insertItems,insertArrayEquipment.flat(), (err,rows) => {
                res.redirect('/character')
              })

            });

          });

        } else {
          req.session.errorCreate = 'Personnage déjà existant';
          res.redirect('/createCharacter')
        }

      })
  } else {
    req.session.errorCreate = 'Veuillez remplir les champs.';
    res.redirect('/createCharacter')
  }
})

module.exports = router;
