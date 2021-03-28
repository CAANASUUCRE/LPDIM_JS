var sqlite3 = require("sqlite3").verbose();
var path = require('path');
var db_name = path.join(__dirname, "data", "destiny2.db");
var db = new sqlite3.Database(db_name, err => {
  if (err) {
    return console.error(err.message);
  }
  console.log("Connexion réussie à la base de données");
});

// const sql_drop = `DROP TABLE DestinyEquipment`;
// db.run(sql_drop, err => {
//   if (err) {
//     return console.error(err.message);
//   }
//   console.log("Suppression ok");
// });

// const sql_drop2 = `DELETE FROM DestinyCharacter WHERE nameCharacter = 'a';`;
// db.run(sql_drop2, err => {
//   if (err) {
//     return console.error(err.message);
//   }
//   console.log("Suppression ok");
// });


const sql_create_character = `CREATE TABLE IF NOT EXISTS DestinyCharacter (
  IDCharacter INTEGER PRIMARY KEY AUTOINCREMENT,
  NameCharacter VARCHAR(100) NOT NULL,
  ClassCharacter VARCHAR(100) NOT NULL,
  GenderCharacter VARCHAR(100) NOT NULL,
  RaceCharacter VARCHAR(100) NOT NULL,
  LightCharacter INTEGER NOT NULL
);`;

const sql_create_equipment = `CREATE TABLE IF NOT EXISTS DestinyEquipment (
  IDEquipment INTEGER PRIMARY KEY AUTOINCREMENT,
  HashEquipment INTEGER NOT NULL,
  NameEquipment VARCHAR(255) NOT NULL,
  LightEquipment INTEGER NOT NULL,
  TypeEquipment VARCHAR(255) NOT NULL,
  UrlImgEquipment VARCHAR(500) NOT NULL,
  IsEquipped BOOLEAN NOT NULL,
  IDCharacter INTEGER NOT NULL
);`;

db.run(sql_create_character, err => {
  if (err) {
    return console.error(err.message);
  }
  console.log("Création réussie de la table 'DestinyCharacter'");
});

db.run(sql_create_equipment, err => {
  if (err) {
    return console.error(err.message);
  }
  console.log("Création réussie de la table 'DestinyEquipment'");
});

module.exports = db
