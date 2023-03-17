// make a function that makes all letters lowercase and removes all spaces and numbers

function toID(str){
    return str.toLowerCase().replace(/\s/g, '').replace(/\d/g, '');
}

function getWeaponAbilities(weapon, level){
    let data = require('origindb')('data');
    let weaponIndex = data('branch').get('weapon');

    // find if the weapon is inside the branch variable 
    if(weaponIndex.indexOf(weapon) > -1){
        // find which branch the weapon belongs to
        let branchIndex = data('branch').get('branch');
        for (let i = 0; i < branchIndex.length; i++){
            if (data('branch').get(branchIndex[i]).includes(weapon)){
                // get the weapon's abilities
                let abilities = data(toID(branchIndex[i])).get(weapon);
                console.log(abilities);
            }
        }
    }
}

module.exports =  {
    getWeaponAbilities: function(weapon, level) {
        getWeaponAbilities(weapon, level);
    }
}