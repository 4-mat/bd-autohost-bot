function getWeaponAbilities(weapon, level){
    let data = require('origindb')('data');
    let branch = data('branch').get('dueler');
    console.log(data('branch').keys('dueler'));
}

module.exports =  {
    getWeaponAbilities: function(weapon, level) {
        getWeaponAbilities(weapon, level);
    }
}

getWeaponAbilities('Spellbook', 10);