/**
 * This is the file where the bot commands are located
 *
 * @license MIT license
 */

var http = require('http');
var format = require('$format');

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

exports.commands = {
	present: function(arg, user, room){
		let userName = user.id; let title = 'BDgame';
		let htmlpageIntro = `/sendhtmlpage ${userName}, ${title}`;

		let contents = '';

		let returnStatement = `${htmlpageIntro}, ${contents}`;
		return this.say(room, returnStatement)
	}
}