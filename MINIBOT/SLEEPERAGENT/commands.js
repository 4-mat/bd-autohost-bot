/**
 * This is the file where the bot commands are located
 *
 * @license MIT license
 */

var group = require('origindb')('group');
var http = require('http');
var nerdamer = require('nerdamer'); 
// Load additional modules. These are not required.  
require('nerdamer/Algebra'); 
require('nerdamer/Calculus'); 
require('nerdamer/Solve'); 
require('nerdamer/Extra');

var SQUAD; var roomID;
var clearance = ['mafiassatan','mymemoryisbad','boicamer']; //if (clearance.indexOf(user.id) == -1) return false;
var partnerName = 'mafiassatan';

if (config.serverid === 'showdown') {
	var https = require('https');
	var csv = require('csv-parse');
}

// .set constants
const CONFIGURABLE_COMMANDS = {
	autoban: true,
	banword: true,
	say: true,
	joke: true,
	usagestats: true,
	'8ball': true,
	guia: true,
	studio: true,
	wifi: true,
	monotype: true,
	survivor: true,
	happy: true,
	buzz: true
};

const CONFIGURABLE_MODERATION_OPTIONS = {
	flooding: true,
	caps: true,
	stretching: true,
	bannedwords: true
};

const CONFIGURABLE_COMMAND_LEVELS = {
	off: false,
	disable: false,
	'false': false,
	on: true,
	enable: true,
	'true': true
};

for (let i in config.groups) {
	if (i !== ' ') CONFIGURABLE_COMMAND_LEVELS[i] = i;
}

exports.commands = { //command symbols % and /uhtm
	c: function(arg, user, room){
		return this.say(room, arg);
	},
	l: function(arg, user, room){
		args = arg.split(',');
		if (args[0].includes('playerlist')){
			// reverse the ice kyubs process to send all of that bullshit
		} else if (args[0].includes('wt')){
			// same here
		} else if (args[1].includes('infobox')){
			text = '/pm thatcableguy, ^updatesquadto ';
			// same here ig
			let TO = arg.split('Turn Order: ');
			TO = TO[1].slice(0, TO[1].indexOf('<'));
			
			if (!toID(TO).includes("devilsdragon")) return false
			text += TO;
			return this.say(room, text);
		} else { // else its a %map probably so
			// lets store the map is FLAG_MOVE is true
			// remember to set the flag to false after we get the %map
			//if its not a map its just dumped
			FLAG_MOVE = false;
			// same here 
		}
	},
	host: function(arg, user, room){
		if (toID(arg) === "lifehaxgamer"){
			this.say(room, '/pm lifehaxgamer, Rolc /pm icekyubs, %gchat');
			this.say(room, '/pm lifehaxgamer, Rolc /pm icekyubs, %bp ' + partnerName);
			return this.say(room, '/pm thatcableguy, ^setgame');
		}
		if (toID(arg) !== partnerName) return false;
		// tell thatcableguy to send mafiassatan a button
		return this.say(room, '/pm thatcableguy, ^start');
	},
	go: function(arg, user, room){
		return this.say(room, '/join ' + arg);
	},
	move: function(arg, user, room){ // this code is here to make the "FLAG_MOVE" true
		this.say(room, '/pm lifehaxgamer, test');
		return FLAG_MOVE = true;
	},
	movem: function(arg, user, room){ // this code is here for "FLAG_MOVE" true as well
		this.say(room, '/pm lifehaxgamer, testm');
		return FLAG_MOVE = true;
	},
};
