let db = require('../db');

function parseJsonToSQLite(array) {
  var tabTemp = []

  array.forEach(e => {
    var eTemp = e.json
    var eParsed = JSON.parse(eTemp)
    tabTemp.push(eParsed)
  })

  return tabTemp
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function numAverage(a) {
  var b = a.length,
      c = 0, i;
  for (i = 0; i < b; i++){
    c += Number(a[i]);
  }
  return c/b;
}

exports.parseJsonToSQLite = parseJsonToSQLite;
exports.getRandomInt = getRandomInt;
exports.numAverage = numAverage;
