/**
 * This is the file where the bot commands are located
 *
 * @license MIT license
 */
var fs = require('fs').promises;
var path = require('path');
var test = "abort";
var group = require('origindb')('group');
let uhtml = require('origindb')('uhtml');
var http = require('http');
var format = require('$format/misc');

let stop = false;


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
};

function reloadFunction(){
	try {
		this.uncacheTree('./commands.js');
		Commands = require('./commands.js').commands;
	} catch (e) {
		error('failed to reload: ' + e.stack);
	}
};

exports.commands = {
	hp: function(arg, user, room){
	},
	holirank: function(arg, user, room){
		this.say(room, "/msgroom bd, /join groupchat-battledome-one");
		this.say(room, "/msgroom bd, /join groupchat-battledome-two");
		this.say(room, "/msgroom bd, /join groupchat-battledome-three");
	},
	r: function(arg, user, room){
	},
	Openbsu: 'openbsu',
	openbsu: function (arg, user, room){
		if(test === "abort") return false;
		return this.say(room, "/pm icekyubs, %j");
	},
	pl: function (arg, user, room){
		var UHTMLcontents = format.getUHTMLcontents();
		if(!UHTMLcontents.includes('Player Data')) return false;
		let turnorder = UHTMLcontents.split('Turn Order: ')[1].split('</b>')[0].split(',');
		for (let i = 0; i < turnorder.length; i++) {
			const element = turnorder[i];
			if (element.includes("(RIP)")) {
				turnorder.splice(i, 1);
				continue;
			}
			if (element.includes(" (")) turnorder[i] = turnorder[i].split(" (")[0];
		}
		if(test === "abort" && turnorder.includes('4mat')) return this.say(room, '/me ffa');
	},
	/*bsu: function(arg, user, room){
		var UHTMLcontents = format.getUHTMLcontents();
		if(!UHTMLcontents.includes('Player Data')) return false;
		let turnorder = UHTMLcontents.split('Turn Order: ')[1].split('</b>')[0].split(',');
		for (let i = 0; i < turnorder.length; i++) {
			const element = turnorder[i];
			if (element.includes("(RIP)")) {
				turnorder.splice(i, 1);
				continue;
			}
			if (element.includes(" (")) turnorder[i] = turnorder[i].split(" (")[0];
		}

		if (arg === "sub" && !turnorder.includes('4mat')) this.say(room, '/me in');
	},*/
	c: 'custom',
	custom: function (arg, user, room) {
		if (!user.isExcepted()) return false;
		if (!(user.id === "sleepwalkinqqq" || 'Lunchmanjeff111')) return false;
		// Custom commands can be executed in an arbitrary room using the syntax
		// ".custom [room] command", e.g., to do !data pikachu in the room lobby,
		// the command would be ".custom [lobby] !data pikachu". However, using
		// "[" and "]" in the custom command to be executed can mess this up, so
		// be careful with them.
		if (arg.indexOf('[') !== 0 || arg.indexOf(']') < 0) {
			return this.say(room, arg);
		}
		var tarRoomid = arg.slice(1, arg.indexOf(']'));
		if (tarRoomid === 'bd') tarRoomid = "battledome";
		var tarRoom = Rooms.get(tarRoomid);
		if (!tarRoom) return this.say(room, Users.self.name + ' is not in room ' + tarRoomid + '!');
		arg = arg.substr(arg.indexOf(']') + 1).trim();
		this.say(tarRoom, arg);
	},
	reload: function (arg, user, room) {
		if (!user.isExcepted() /*&& clearance.indexOf(user.id) == -1*/) return false;
		try {
			this.uncacheTree('./commands.js');
			Commands = require('./commands.js').commands;
			this.say(room, 'reloaded');
		} catch (e) {
			error('failed to reload: ' + e.stack);
		}
	},
	js: function (arg, user, room) {
		if (!user.isExcepted()) return false;
		try {
			let result = eval(arg.trim());
			this.say(room, JSON.stringify(result));
		} catch (e) {
			this.say(room, e.name + ": " + e.message);
		}
	},
	stopthis: function(arg, user, room){
		stop = true;
	},
	startthis: function(arg, user, room){
		stop = false;
	},
	locksquad: function(arg, user, room){
		format.lockSquad(arg);
		return this.say(room, "Locked squad to " + arg + ".");
	},
	/*grt: function(arg, user, room){
		if(stop) return false;
		this.say(room, '/pm oases, %c %grt');
	},*/
	cut: function(arg, user, room){
		var userName = ""; let title = 'BDgame';
		
		var UHTMLcontents = format.getUHTMLcontents();
		timeStampOfContents = UHTMLcontents.split(" /")[0];
		UHTMLcontents = UHTMLcontents.split(",");
		UHTMLcontents.shift();
		UHTMLcontents = UHTMLcontents.join(",");
		UHTMLcontents = timeStampOfContents + UHTMLcontents;
		let turnorder;
		if(UHTMLcontents.includes('Player Data')){

		// below code is going to be deprecated lol

		/*turnorder = UHTMLcontents.split('Turn Order: ')[1].split('</b>')[0].split(',');
		for (let i = 0; i < turnorder.length; i++) {
			const element = turnorder[i];
			if (element.includes("(RIP)")) {
				turnorder.splice(i, 1);
				continue;
			}
			if (element.includes(" (")) turnorder[i] = turnorder[i].split(" (")[0];
		}*/

		}
		//userName = turnorder[arg-1];

		// actual code time

		let PLofSquad = format.getStats();
		
		try {userName = PLofSquad[arg-1].Name}
		catch (error) {return this.say(room, "No such player.");}

		let playerPosition = format.getPlayerPosition();

		turnorder = format.getTOcontents();
		for (let i = 0; i < turnorder.length; i++) {
			const element = turnorder[i];
			if (element.includes("(RIP)")) {
				turnorder.splice(i, 1);
				continue;
			}
			if (element.includes("(")) turnorder[i] = turnorder[i].split("(")[0];
		}

		for (let i = 0; i < turnorder.length; i++) {
			let htmlpageIntro = `/sendhtmlpage ${turnorder[i]}, ${title}`;
			let returnStatement = `${htmlpageIntro}, ${UHTMLcontents} It's ${turnorder[arg-1]}'s turn`;
			this.say(room, `/msgroom botdev, ${returnStatement} <br> ${playerPosition}`);
		};
		let gaming = format.getClassAndWeap(userName);
	
		let playerClass = gaming ? gaming.split('/')[0] : "Cryokinetic(10)"; 
		let playerWeapon = gaming ? gaming.split('/')[1] : "Tarot Cards(10)";
		playerClass = playerClass.replace(')','').split('(');
		playerWeapon = playerWeapon.replace(')','').split('(');

		let weaponMoves = format.makeButtonsForWeapon(playerWeapon[0], Number(playerWeapon[1]), format.getRoom(), format.getStats(userName));

		let htmlpageIntro = `/sendhtmlpage ${userName}, ${title}`;
		
		let returnStatement = `${htmlpageIntro}, ${UHTMLcontents} GO ${userName} <br> ${weaponMoves} <br> ${playerPosition}`;
		this.say(room, `/msgroom botdev, ${returnStatement}`);
	},
	use: function(arg, user, room){
		var userName = ""; let title = 'BDgame';
		
		var UHTMLcontents = format.getUHTMLcontents();
		timeStampOfContents = UHTMLcontents.split(" /")[0];
		UHTMLcontents = UHTMLcontents.split(",");
		UHTMLcontents.shift();
		UHTMLcontents = UHTMLcontents.join(",");
		UHTMLcontents = timeStampOfContents + UHTMLcontents;
		let turnorder;

		let htmlpageIntro = `/sendhtmlpage ${userName}, ${title}`;

		let weaponMoves2 = format.getWeaponMoves();
		let weaponMove = weaponMoves2[arg];

		turnorder = format.getTOcontents();
		for (let i = 0; i < turnorder.length; i++) {
			const element = turnorder[i];
			if (element.includes("(RIP)")) {
				turnorder.splice(i, 1);
				continue;
			}
			if (element.includes("(")) turnorder[i] = turnorder[i].split("(")[0];
		}
		// `<button class='button' name='send' value='/msgroom ${room}, ${ability.Name} @ target ${roll} MR ${ability.MR} | secondary effect goes here'>${ability.Name}</button>`;
		
		let weaponMoves = "";
		for (let i = 0; i < turnorder.length; i++) {
            weaponMove = weaponMove.replace(target, turnorder[i]);
            weaponMoves = weaponMoves + weaponMove;
        };

		let returnStatement = `${htmlpageIntro}, ${UHTMLcontents} GO ${userName} <br> ${weaponMoves}`;
		this.say(room, `/msgroom botdev, ${returnStatement}`);
    },
}