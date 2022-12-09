/**
 * This is the file where the bot commands are located
 *
 * @license MIT license
 */

var http = require('http');
var nerdamer = require('nerdamer'); 
// Load additional modules. These are not required.  
require('nerdamer/Algebra'); 
require('nerdamer/Calculus'); 
require('nerdamer/Solve'); 
require('nerdamer/Extra');

var SQUAD; var FLAG_LASTMOVE;
var FLAG_MEM = "";
var FLAG_MOVE = false;
var COMBO = "skirmwand";
var clearance = ['mafiassatan','mymemoryisbad','boicamer']; //if (clearance.indexOf(user.id) == -1) return false;


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

exports.commands = { // command symbols: Rol
	c: function(arg, user, room){
		return this.say(room, arg);
	},
	js: function (arg, user, room) {
		try {
			let result = eval(arg.trim());
			this.say(room, JSON.stringify(result));
		} catch (e) {
			this.say(room, e.name + ": " + e.message);
		}
	},
	setgc: function(arg, user, room){
		this.say(room, '/pm icekyubs, %gchat');
		this.say(room, '/pm icekyubs, %bp mafiassatan');
		// what was the last room i joined?
		// use export to figure it out
		fs.readFile('lastroom.txt', 'utf8', (err, data) => {
			if (err) {
			  console.log(err);
			  return;
			}
			console.log(data);
			SQUAD = data;
			});
		this.say(room, '/pm sleepwalkinqqq, go ' + SQUAD);
		return this.say(room, '/pm thatcableguy, ^setgame ' + SQUAD);
	},
	mem: function(arg, user, room){
		FLAG_MEM = arg;
	},
	m: function(arg, user, room){
		let text = '/msgroom '+SQUAD+', %move ' + arg;
		return this.say(room, text);
	},
	tunneling: "tunnel",
	tunnel: function (arg, user, room) {
		let text = '/msgroom '+SQUAD+', /me tunneling';
		return this.say(room, text);
	},
	blight:"bl",
	bl: function(arg, user, room){ // blight
		let args = arg.split(" ");
		let text = '/msgroom groupchat-battledome-'+SQUAD+', /me ';
		for (let i = 0; i < args.length; i++) {
			const element = args[i];
			if (element === "ener" || element === "outman"){
				text = text + element;
			};
		}
		text = text + 'blight max sac psn 10/1 @ Mafia\'s Satan ';
		this.say(room, text);
		return this.say(room, '/msgroom groupchat-battledome-'+SQUAD+',%r 20');
	},
	lastmove: function(arg, user, room){
		FLAG_LASTMOVE = arg;
	},
	"l:": function(arg, user, room){
		return this.say(room, '/pm thatcableguy, ^rroll ' + arg + " w " + FLAG_MEM);
	},
	"ls:": function(arg, user, room){
		return this.say(room, '/pm thatcableguy, ^rroll ' + arg + " w " + FLAG_MEM);
	},
};
