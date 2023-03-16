const {writeFileSync} = require('fs');


const oldObject = require('./data.json');
const newObject = {};
let currentClass;
//console.log(JSON.stringify(oldObject))
for (const key in oldObject) {
    console.log(key);
  }
console.log(oldObject.Stats);
for (const object of oldObject.Stats) {
    if (Object.keys(object).length === 1) { // class name
        //if (object.Name.includes("Abilities")){continue}
        currentClass = object.Name;
        newObject[currentClass] = [];
    } else {
        newObject[currentClass].push(object);
    }
}

writeFileSync('./classstats.json', JSON.stringify(newObject));