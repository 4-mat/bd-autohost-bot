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

var SQUAD;
var clearance = ['mafiassatan','mymemoryisbad']; //if (clearance.indexOf(user.id) == -1) return false;


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
	/**
	 * Help commands
	 *
	 * These commands are here to provide information about the bot.
	 */

	credits: 'about',
	about: function (arg, user, room) {
		var text = (room === user || user.hasRank(room.id, '#')) ? '' : '/pm ' + user.id + ', ';
		text += '**Pokémon Showdown Bot** by: Quinella, TalkTakesTime, and Morfent';
		this.say(room, text);
	},
	git: function (arg, user, room) {
		var text = (room === user || user.isExcepted()) ? '' : '/pm ' + user.id + ', ';
		text += '**Pokemon Showdown Bot** source code: ' + config.fork;
		this.say(room, text);
	},
	help: 'guide',
	guide: function (arg, user, room) {
		var text = (room === user || user.hasRank(room.id, '#'))  ? '' : '/pm ' + user.id + ', ';
		if (config.botguide) {
			text += 'A guide on how to use this bot can be found here: ' + config.botguide;
		} else {
			text += 'There is no guide for this bot. PM the owner with any questions.';
		}
		this.say(room, text);
	},

	/**
	 * Dev commands
	 *
	 * These commands are here for highly ranked users (or the creator) to use
	 * to perform arbitrary actions that can't be done through any other commands
	 * or to help with upkeep of the bot.
	 */
	c: 'custom',
	custom: function (arg, user, room) {
		if (!user.isExcepted()) return false;
		// Custom commands can be executed in an arbitrary room using the syntax
		// ".custom [room] command", e.g., to do !data pikachu in the room lobby,
		// the command would be ".custom [lobby] !data pikachu". However, using
		// "[" and "]" in the custom command to be executed can mess this up, so
		// be careful with them.
		if (arg.indexOf('[') !== 0 || arg.indexOf(']') < 0) {
			return this.say(room, arg);
		}
		var tarRoomid = arg.slice(1, arg.indexOf(']'));
		var tarRoom = Rooms.get(tarRoomid);
		if (!tarRoom) return this.say(room, Users.self.name + ' is not in room ' + tarRoomid + '!');
		arg = arg.substr(arg.indexOf(']') + 1).trim();
		this.say(tarRoom, arg);
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
	reload: function (arg, user, room) {
		if (!user.isExcepted() && clearance.indexOf(user.id) == -1) return false;
		try {
			this.uncacheTree('./commands.js');
			Commands = require('./commands.js').commands;
			this.say(room, 'reloaded');
		} catch (e) {
			error('failed to reload: ' + e.stack);
		}
	},
	custom: function (arg, user, room) {
		if (!user.isExcepted()) return false;
		// Custom commands can be executed in an arbitrary room using the syntax
		// ".custom [room] command", e.g., to do !data pikachu in the room lobby,
		// the command would be ".custom [lobby] !data pikachu". However, using
		// "[" and "]" in the custom command to be executed can mess this up, so
		// be careful with them.
		if (arg.indexOf('[') !== 0 || arg.indexOf(']') < 0) {
			return this.say(room, arg);
		}
		var tarRoomid = arg.slice(1, arg.indexOf(']'));
		var tarRoom = Rooms.get(tarRoomid);
		if (!tarRoom) return this.say(room, Users.self.name + ' is not in room ' + tarRoomid + '!');
		arg = arg.substr(arg.indexOf(']') + 1).trim();
		this.say(tarRoom, arg);
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
	uptime: function (arg, user, room) {
		var text = ((room === user || user.isExcepted()) ? '' : '/pm ' + user.id + ', ') + '**Uptime:** ';
		var divisors = [52, 7, 24, 60, 60];
		var units = ['week', 'day', 'hour', 'minute', 'second'];
		var buffer = [];
		var uptime = ~~(process.uptime());
		do {
			let divisor = divisors.pop();
			let unit = uptime % divisor;
			buffer.push(unit > 1 ? unit + ' ' + units.pop() + 's' : unit + ' ' + units.pop());
			uptime = ~~(uptime / divisor);
		} while (uptime);

		switch (buffer.length) {
		case 5:
			text += buffer[4] + ', ';
			/* falls through */
		case 4:
			text += buffer[3] + ', ';
			/* falls through */
		case 3:
			text += buffer[2] + ', ' + buffer[1] + ', and ' + buffer[0];
			break;
		case 2:
			text += buffer[1] + ' and ' + buffer[0];
			break;
		case 1:
			text += buffer[0];
			break;
		}

		this.say(room, text);
	}, 


	/**
	 * Room Owner commands
	 *
	 * These commands allow room owners to personalise settings for moderation and command use.
	 */

	settings: 'set',
	set: function (arg, user, room) {
		if (room === user || !user.hasRank(room.id, '#')) return false;

		var opts = arg.split(',');
		var cmd = toID(opts[0]);
		var roomid = room.id;
		if (cmd === 'm' || cmd === 'mod' || cmd === 'modding') {
			let modOpt;
			if (!opts[1] || !CONFIGURABLE_MODERATION_OPTIONS[(modOpt = toID(opts[1]))]) {
				return this.say(room, 'Incorrect command: correct syntax is ' + config.commandcharacter + 'set mod, [' +
					Object.keys(CONFIGURABLE_MODERATION_OPTIONS).join('/') + '](, [on/off])');
			}
			if (!opts[2]) return this.say(room, 'Moderation for ' + modOpt + ' in this room is currently ' +
				(this.settings.modding && this.settings.modding[roomid] && modOpt in this.settings.modding[roomid] ? 'OFF' : 'ON') + '.');

			if (!this.settings.modding) this.settings.modding = {};
			if (!this.settings.modding[roomid]) this.settings.modding[roomid] = {};

			let setting = toID(opts[2]);
			if (setting === 'on') {
				delete this.settings.modding[roomid][modOpt];
				if (Object.isEmpty(this.settings.modding[roomid])) delete this.settings.modding[roomid];
				if (Object.isEmpty(this.settings.modding)) delete this.settings.modding;
			} else if (setting === 'off') {
				this.settings.modding[roomid][modOpt] = 0;
			} else {
				return this.say(room, 'Incorrect command: correct syntax is ' + config.commandcharacter + 'set mod, [' +
					Object.keys(CONFIGURABLE_MODERATION_OPTIONS).join('/') + '](, [on/off])');
			}

			this.writeSettings();
			return this.say(room, 'Moderation for ' + modOpt + ' in this room is now ' + setting.toUpperCase() + '.');
		}

		if (!(cmd in Commands)) return this.say(room, config.commandcharacter + '' + opts[0] + ' is not a valid command.');

		var failsafe = 0;
		while (true) {
			if (typeof Commands[cmd] === 'string') {
				cmd = Commands[cmd];
			} else if (typeof Commands[cmd] === 'function') {
				if (cmd in CONFIGURABLE_COMMANDS) break;
				return this.say(room, 'The settings for ' + config.commandcharacter + '' + opts[0] + ' cannot be changed.');
			} else {
				return this.say(room, 'Something went wrong. PM Morfent or TalkTakesTime here or on Smogon with the command you tried.');
			}

			if (++failsafe > 5) return this.say(room, 'The command "' + config.commandcharacter + '' + opts[0] + '" could not be found.');
		}

		if (!opts[1]) {
			let msg = '' + config.commandcharacter + '' + cmd + ' is ';
			if (!this.settings[cmd] || (!(roomid in this.settings[cmd]))) {
				msg += 'available for users of rank ' + ((cmd === 'autoban' || cmd === 'banword') ? '#' : config.defaultrank) + ' and above.';
			} else if (this.settings[cmd][roomid] in CONFIGURABLE_COMMAND_LEVELS) {
				msg += 'available for users of rank ' + this.settings[cmd][roomid] + ' and above.';
			} else {
				msg += this.settings[cmd][roomid] ? 'available for all users in this room.' : 'not available for use in this room.';
			}

			return this.say(room, msg);
		}

		let setting = opts[1].trim();
		if (!(setting in CONFIGURABLE_COMMAND_LEVELS)) return this.say(room, 'Unknown option: "' + setting + '". Valid settings are: off/disable/false, +, %, @, #, &, ~, on/enable/true.');
		if (!this.settings[cmd]) this.settings[cmd] = {};
		this.settings[cmd][roomid] = CONFIGURABLE_COMMAND_LEVELS[setting];

		this.writeSettings();
		this.say(room, 'The command ' + config.commandcharacter + '' + cmd + ' is now ' +
			(CONFIGURABLE_COMMAND_LEVELS[setting] === setting ? ' available for users of rank ' + setting + ' and above.' :
			(this.settings[cmd][roomid] ? 'available for all users in this room.' : 'unavailable for use in this room.')));
	},
	blacklist: 'autoban',
	ban: 'autoban',
	ab: 'autoban',
	autoban: function (arg, user, room) {
		if (room === user || !user.canUse('autoban', room.id)) return false;
		if (!Users.self.hasRank(room.id, '@')) return this.say(room, Users.self.name + ' requires rank of @ or higher to (un)blacklist.');
		if (!toID(arg)) return this.say(room, 'You must specify at least one user to blacklist.');

		arg = arg.split(',');
		var added = [];
		var illegalNick = [];
		var alreadyAdded = [];
		var roomid = room.id;
		for (let u of arg) {
			let tarUser = toID(u);
			if (!tarUser || tarUser.length > 18) {
				illegalNick.push(tarUser);
			} else if (!this.blacklistUser(tarUser, roomid)) {
				alreadyAdded.push(tarUser);
			} else {
				added.push(tarUser);
				this.say(room, '/roomban ' + tarUser + ', Blacklisted user');
			}
		}

		var text = '';
		if (added.length) {
			text += 'User' + (added.length > 1 ? 's "' + added.join('", "') + '" were' : ' "' + added[0] + '" was') + ' added to the blacklist.';
			this.say(room, '/modnote ' + text + ' by ' + user.name + '.');
			this.writeSettings();
		}
		if (alreadyAdded.length) {
			text += ' User' + (alreadyAdded.length > 1 ? 's "' + alreadyAdded.join('", "') + '" are' : ' "' + alreadyAdded[0] + '" is') + ' already present in the blacklist.';
		}
		if (illegalNick.length) text += (text ? ' All other' : 'All') + ' users had illegal nicks and were not blacklisted.';
		this.say(room, text);
	},
	unblacklist: 'unautoban',
	unban: 'unautoban',
	unab: 'unautoban',
	unautoban: function (arg, user, room) {
		if (room === user || !user.canUse('autoban', room.id)) return false;
		if (!Users.self.hasRank(room.id, '@')) return this.say(room, Users.self.name + ' requires rank of @ or higher to (un)blacklist.');
		if (!toID(arg)) return this.say(room, 'You must specify at least one user to unblacklist.');

		arg = arg.split(',');
		var removed = [];
		var notRemoved = [];
		var roomid = room.id;
		for (let u of arg) {
			let tarUser = toID(u);
			if (!tarUser || tarUser.length > 18) {
				notRemoved.push(tarUser);
			} else if (!this.unblacklistUser(tarUser, roomid)) {
				notRemoved.push(tarUser);
			} else {
				removed.push(tarUser);
				this.say(room, '/roomunban ' + tarUser);
			}
		}

		var text = '';
		if (removed.length) {
			text += ' User' + (removed.length > 1 ? 's "' + removed.join('", "') + '" were' : ' "' + removed[0] + '" was') + ' removed from the blacklist';
			this.say(room, '/modnote ' + text + ' by user ' + user.name + '.');
			this.writeSettings();
		}
		if (notRemoved.length) text += (text.length ? ' No other' : 'No') + ' specified users were present in the blacklist.';
		this.say(room, text);
	},
	rab: 'regexautoban',
	regexautoban: function (arg, user, room) {
		if (room === user || !user.isRegexWhitelisted() || !user.canUse('autoban', room.id)) return false;
		if (!Users.self.hasRank(room.id, '@')) return this.say(room, Users.self.name + ' requires rank of @ or higher to (un)blacklist.');
		if (!arg) return this.say(room, 'You must specify a regular expression to (un)blacklist.');

		try {
			new RegExp(arg, 'i');
		} catch (e) {
			return this.say(room, e.message);
		}

		if (/^(?:(?:\.+|[a-z0-9]|\\[a-z0-9SbB])(?![a-z0-9\.\\])(?:\*|\{\d+\,(?:\d+)?\}))+$/i.test(arg)) {
			return this.say(room, 'Regular expression /' + arg + '/i cannot be added to the blacklist. Don\'t be Machiavellian!');
		}

		var regex = '/' + arg + '/i';
		if (!this.blacklistUser(regex, room.id)) return this.say(room, '/' + regex + ' is already present in the blacklist.');

		var regexObj = new RegExp(arg, 'i');
		var users = room.users.entries();
		var groups = config.groups;
		var selfid = Users.self.id;
		var selfidx = groups[room.users.get(selfid)];
		for (let u of users) {
			let userid = u[0];
			if (userid !== selfid && regexObj.test(userid) && groups[u[1]] < selfidx) {
				this.say(room, '/roomban ' + userid + ', Blacklisted user');
			}
		}

		this.writeSettings();
		this.say(room, '/modnote Regular expression ' + regex + ' was added to the blacklist by user ' + user.name + '.');
		this.say(room, 'Regular expression ' + regex + ' was added to the blacklist.');
	},
	unrab: 'unregexautoban',
	unregexautoban: function (arg, user, room) {
		if (room === user || !user.isRegexWhitelisted() || !user.canUse('autoban', room.id)) return false;
		if (!Users.self.hasRank(room.id, '@')) return this.say(room, Users.self.name + ' requires rank of @ or higher to (un)blacklist.');
		if (!arg) return this.say(room, 'You must specify a regular expression to (un)blacklist.');

		arg = '/' + arg.replace(/\\\\/g, '\\') + '/i';
		if (!this.unblacklistUser(arg, room.id)) return this.say(room, '/' + arg + ' is not present in the blacklist.');

		this.writeSettings();
		this.say(room, '/modnote Regular expression ' + arg + ' was removed from the blacklist user by ' + user.name + '.');
		this.say(room, 'Regular expression ' + arg + ' was removed from the blacklist.');
	},
	viewbans: 'viewblacklist',
	vab: 'viewblacklist',
	viewautobans: 'viewblacklist',
	viewblacklist: function (arg, user, room) {
		if (room === user || !user.canUse('autoban', room.id)) return false;

		var text = '/pm ' + user.id + ', ';
		if (!this.settings.blacklist) return this.say(room, text + 'No users are blacklisted in this room.');

		var roomid = room.id;
		var blacklist = this.settings.blacklist[roomid];
		if (!blacklist) return this.say(room, text + 'No users are blacklisted in this room.');

		if (!arg.length) {
			let userlist = Object.keys(blacklist);
			if (!userlist.length) return this.say(room, text + 'No users are blacklisted in this room.');
			return this.uploadToHastebin('The following users are banned from ' + roomid + ':\n\n' + userlist.join('\n'), function (link) {
				if (link.startsWith('Error')) return this.say(room, text + link);
				this.say(room, text + 'Blacklist for room ' + roomid + ': ' + link);
			}.bind(this));
		}

		var nick = toID(arg);
		if (!nick || nick.length > 18) {
			text += 'Invalid username: "' + nick + '".';
		} else {
			text += 'User "' + nick + '" is currently ' + (blacklist[nick] || 'not ') + 'blacklisted in ' + roomid + '.';
		}
		this.say(room, text);
	},
	banphrase: 'banword',
	banword: function (arg, user, room) {
		arg = arg.trim().toLowerCase();
		if (!arg) return false;

		var tarRoom = room.id;
		if (room === user) {
			if (!user.isExcepted()) return false;
			tarRoom = 'global';
		} else if (user.canUse('banword', room.id)) {
			tarRoom = room.id;
		} else {
			return false;
		}

		var bannedPhrases = this.settings.bannedphrases ? this.settings.bannedphrases[tarRoom] : null;
		if (!bannedPhrases) {
			if (bannedPhrases === null) this.settings.bannedphrases = {};
			bannedPhrases = (this.settings.bannedphrases[tarRoom] = {});
		} else if (bannedPhrases[arg]) {
			return this.say(room, 'Phrase "' + arg + '" is already banned.');
		}
		bannedPhrases[arg] = 1;

		this.writeSettings();
		this.say(room, 'Phrase "' + arg + '" is now banned.');
	},
	unbanphrase: 'unbanword',
	unbanword: function (arg, user, room) {
		var tarRoom;
		if (room === user) {
			if (!user.isExcepted()) return false;
			tarRoom = 'global';
		} else if (user.canUse('banword', room.id)) {
			tarRoom = room.id;
		} else {
			return false;
		}

		arg = arg.trim().toLowerCase();
		if (!arg) return false;
		if (!this.settings.bannedphrases) return this.say(room, 'Phrase "' + arg + '" is not currently banned.');

		var bannedPhrases = this.settings.bannedphrases[tarRoom];
		if (!bannedPhrases || !bannedPhrases[arg]) return this.say(room, 'Phrase "' + arg + '" is not currently banned.');

		delete bannedPhrases[arg];
		if (Object.isEmpty(bannedPhrases)) {
			delete this.settings.bannedphrases[tarRoom];
			if (Object.isEmpty(this.settings.bannedphrases)) delete this.settings.bannedphrases;
		}

		this.writeSettings();
		this.say(room, 'Phrase "' + arg + '" is no longer banned.');
	},
	viewbannedphrases: 'viewbannedwords',
	vbw: 'viewbannedwords',
	viewbannedwords: function (arg, user, room) {
		var tarRoom = room.id;
		var text = '';
		var bannedFrom = '';
		if (room === user) {
			if (!user.isExcepted()) return false;
			tarRoom = 'global';
			bannedFrom += 'globally';
		} else if (user.canUse('banword', room.id)) {
			text += '/pm ' + user.id + ', ';
			bannedFrom += 'in ' + room.id;
		} else {
			return false;
		}

		if (!this.settings.bannedphrases) return this.say(room, text + 'No phrases are banned in this room.');
		var bannedPhrases = this.settings.bannedphrases[tarRoom];
		if (!bannedPhrases) return this.say(room, text + 'No phrases are banned in this room.');

		if (arg.length) {
			text += 'The phrase "' + arg + '" is currently ' + (bannedPhrases[arg] || 'not ') + 'banned ' + bannedFrom + '.';
			return this.say(room, text);
		}

		var banList = Object.keys(bannedPhrases);
		if (!banList.length) return this.say(room, text + 'No phrases are banned in this room.');

		this.uploadToHastebin('The following phrases are banned ' + bannedFrom + ':\n\n' + banList.join('\n'), function (link) {
			if (link.startsWith('Error')) return this.say(room, link);
			this.say(room, text + 'Banned phrases ' + bannedFrom + ': ' + link);
		}.bind(this));
	},

	/**
	 * General commands
	 *
	 * Add custom commands here.
	 */

	tell: 'say',
	say: function (arg, user, room) {
		if (room === user || !user.canUse('say', room.id)) return false;
		this.say(room, stripCommands(arg) + ' (' + user.name + ' said this)');
	},
	joke: function (arg, user, room) {
		if (room === user || !user.canUse('joke', room.id)) return false;
		var self = this;

		var reqOpt = {
			hostname: 'api.icndb.com',
			path: '/jokes/random',
			method: 'GET'
		};
		var req = http.request(reqOpt, function (res) {
			res.on('data', function (chunk) {
				try {
					let data = JSON.parse(chunk);
					self.say(room, data.value.joke.replace(/&quot;/g, "\""));
				} catch (e) {
					self.say(room, 'Sorry, couldn\'t fetch a random joke... :(');
				}
			});
		});
		req.end();
	},
	usage: 'usagestats',
	usagestats: function (arg, user, room) {
		if (arg) return false;
		var text = (room === user || user.canUse('usagestats', room.id)) ? '' : '/pm ' + user.id + ', ';
		text += 'http://www.smogon.com/stats/2015-07/';
		this.say(room, text);
	},
	seen: function (arg, user, room) { // this command is still a bit buggy
		var text = (room === user ? '' : '/pm ' + user.id + ', ');
		arg = toID(arg);
		if (!arg || arg.length > 18) return this.say(room, text + 'Invalid username.');
		if (arg === user.id) {
			text += 'Have you looked in the mirror lately?';
		} else if (arg === Users.self.id) {
			text += 'You might be either blind or illiterate. Might want to get that checked out.';
		} else if (!this.chatData[arg] || !this.chatData[arg].seenAt) {
			text += 'The user ' + arg + ' has never been seen.';
		} else {
			text += arg + ' was last seen ' + this.getTimeAgo(this.chatData[arg].seenAt) + ' ago' + (
				this.chatData[arg].lastSeen ? ', ' + this.chatData[arg].lastSeen : '.');
		}
		this.say(room, text);
	},
	'8ball': function (arg, user, room) {
		if (room === user) return false;
		var text = user.canUse('8ball', room.id) ? '' : '/pm ' + user.id + ', ';
		var rand = ~~(20 * Math.random());

		switch (rand) {
	 		case 0:
				text += "Signs point to yes.";
				break;
	  		case 1:
				text += "Yes.";
				break;
			case 2:
				text += "Reply hazy, try again.";
				break;
			case 3:
				text += "Without a doubt.";
				break;
			case 4:
				text += "My sources say no.";
				break;
			case 5:
				text += "As I see it, yes.";
				break;
			case 6:
				text += "You may rely on it.";
				break;
			case 7:
				text += "Concentrate and ask again.";
				break;
			case 8:
				text += "Outlook not so good.";
				break;
			case 9:
				text += "It is decidedly so.";
				break;
			case 10:
				text += "Better not tell you now.";
				break;
			case 11:
				text += "Very doubtful.";
				break;
			case 12:
				text += "Yes - definitely.";
				break;
			case 13:
				text += "It is certain.";
				break; 
			case 14:
				text += "Cannot predict now.";
				break;
			case 15:
				text += "Most likely.";
				break;
			case 16:
				text += "Ask again later.";
				break;
			case 17:
				text += "My reply is no.";
				break;
			case 18:
				text += "Outlook good.";
				break;
			case 19:
				text += "Don't count on it.";
				break;
		}

		this.say(room, text);
	},

	/**
	 * Room specific commands
	 *
	 * These commands are used in specific rooms on the Smogon server.
	 */
	mono: 'monotype',
	monotype: function (arg, user, room) {
		// links and info for the monotype room
		if (config.serverid !== 'showdown') return false;
		var text = '';
		if (room.id === 'monotype') {
			if (!user.canUse('monotype', room.id)) text += '/pm ' + user.id + ', ';
		} else if (room !== user) {
			return false;
		}
		var messages = {
			cc: 'The monotype room\'s Core Challenge can be found here: http://monotypeps.weebly.com/core-ladder-challenge.html',
			plug: 'The monotype room\'s plug can be found here: https://plug.dj/monotyke-djs',
			rules: 'The monotype room\'s rules can be found here: http://monotypeps.weebly.com/monotype-room.html',
			site: 'The monotype room\'s site can be found here: http://monotypeps.weebly.com/',
			stats: 'You can find the monotype usage stats here: http://monotypeps.weebly.com/stats.html',
			banlist: 'The monotype banlist can be found here: http://monotypeps.weebly.com/monotype-metagame.html'
		};
		text += messages[toID(arg)] || 'Unknown option. If you are looking for something and unable to find it, please ask monotype room staff for help on where to locate what you are looking for. General information can be found here: http://monotypeps.weebly.com/';
		this.say(room, text);
	},
	gc: function (arg, user, room) {
		if (room !== user && clearance.indexOf(user.id) == -1) return false;
		SQUAD = arg;
		this.say(room, '/pm ' + user.id + ', joining ' + SQUAD + ' groupchat.');
		return this.say(room, "/join groupchat-battledome-" + SQUAD);
	},
	tunneling: "tunnel",
	tunnel: function (arg, user, room) {
		if (room !== user && clearance.indexOf(user.id) == -1) return false;
		let text = '/msgroom groupchat-battledome-'+SQUAD+', /me tunneling';
		return this.say(room, text);
	},
	inf: function (arg, user, room) {
		if (room !== user /*&& clearance.indexOf(user.id) == -1*/) return false;
		let text = '/msgroom battledome, %inf';
		return this.say(room, text);
	},
	mbag: function (arg, user, room) {
		if (room !== user /*&& clearance.indexOf(user.id) == -1*/) return false;
		let text = '/msgroom battledome, %mbag';
		return this.say(room, text);
	},
	r: function (arg, user, room) {
		if (room !== user /*&& clearance.indexOf(user.id) == -1*/) return false;
		let text = '/msgroom battledome, %r '+ (arg ? arg : "");
		return this.say(room, text);
	},
	te: function (arg, user, room) {
		if (room !== user && clearance.indexOf(user.id) == -1) return false;
		let text = '/msgroom groupchat-battledome-'+SQUAD+', /me te';
		return this.say(room, text);
	},
	move: function (arg, user, room) {
		if (room !== user && clearance.indexOf(user.id) == -1) return false;
		let text = '/msgroom groupchat-battledome-'+SQUAD+', %move ' + arg;
		return this.say(room, text);
	},
	idle: function (arg, user, room) {
		if (room !== user && clearance.indexOf(user.id) == -1) return false;
		let text = '/msgroom groupchat-battledome-'+SQUAD+', idle ';
		return this.say(room, text);
	},
	sq: function (arg, user, room) {
		if (room !== user && clearance.indexOf(user.id) == -1) return false;
		return this.say(room, '/pm ' + user.id + ',squad ' + SQUAD + ' groupchat is where i send my moves to currently');
	},
	manamissiles:'mm',
	mm: function(arg, user, room){ // mana missiles
		if (room !== user && clearance.indexOf(user.id) == -1) return false;
		let args = arg.split(" ");
		let text = '/msgroom groupchat-battledome-'+SQUAD+', /me ';
		for (let i = 0; i < args.length; i++) {
			const element = args[i];
			if (element === "ener" || element === "outman"){
				text = text + element;
			};
		}
		text = text + 'mana missiles max sac @ Mafia\'s Satan ';
		this.say(room, text);
		return this.say(room, '/msgroom groupchat-battledome-'+SQUAD+', %r 6d20');
	},
	magicshot:'ms',
	ms: function(arg, user, room){ // magic shot
		if (room !== user && clearance.indexOf(user.id) == -1) return false;
		let args = arg.split(" ");
		let text = '/msgroom groupchat-battledome-'+SQUAD+', /me ';
		for (let i = 0; i < args.length; i++) {
			const element = args[i];
			if (element === "ener" || element === "outman"){
				text = text + element + " max sac ";
			};
		}
		text = text + 'magic shot @ Mafia\'s Satan '
		this.say(room, text);
		return this.say(room, '/msgroom groupchat-battledome-'+SQUAD+',%r 20');
	},
	blight:"bl",
	bl: function(arg, user, room){ // blight
		if (room !== user && clearance.indexOf(user.id) == -1) return false;
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
	present: function(arg, user, room) {
		var text = '/sendhtmlpage ' + arg +', game, <div class="infobox"><details open><summary>Map</summary><div style="overflow-x:auto"><table align="center" style="border-spacing:0px;border-collapse:collapse;border:1px solid #888; background:rgba(120, 120, 225, 0.10)" border="1" bordercolor="#888"><tr style="min-height:28px;height:24px"><td style="min-width:22px"></td><td style="min-width:22px" align="center"><b>1</b></td><td style="min-width:22px" align="center"><b>2</b></td><td style="min-width:22px" align="center"><b>3</b></td><td style="min-width:22px" align="center"><b>4</b></td><td style="min-width:22px" align="center"><b>5</b></td><td style="min-width:22px" align="center"><b>6</b></td><td style="min-width:22px" align="center"><b>7</b></td><td style="min-width:22px" align="center"><b>8</b></td><td style="min-width:22px" align="center"><b>9</b></td><td style="min-width:22px" align="center"><b>10</b></td><td style="min-width:22px" align="center"><b>11</b></td></tr><tr style="min-height:24px;height:24px"><td align="center"><b>A</b></td><td style="background:#99E599" title="normal" align="center"><b style="color:#0000C0">P2</b></td><td style="background:#99E599" title="normal"></td><td style="background:#99E599" title="normal"></td><td style="background:#99E599" title="normal"></td><td style="background:#99E599" title="normal"></td><td style="background:#99E599" title="normal"></td><td style="background:#99E599" title="normal"></td><td style="background:#99E599" title="normal"></td><td style="background:#99E599" title="normal"></td><td style="background:#99E599" title="normal"></td><td style="background:#99E599" title="normal"></td></tr><tr style="min-height:24px;height:24px"><td align="center"><b>B</b></td><td style="background:#99E599" title="normal"></td><td style="background:#99E599" title="normal"></td><td style="background:#99E599" title="normal"></td><td style="background:#99E599" title="normal"></td><td style="background:#99E599" title="normal"></td><td style="background:#99E599" title="normal"></td><td style="background:#454FDF" title="water"></td><td style="background:#99E599" title="normal"></td><td style="background:#99E599" title="normal"></td><td style="background:#99E599" title="normal"></td><td style="background:#99E599" title="normal"></td></tr><tr style="min-height:24px;height:24px"><td align="center"><b>C</b></td><td style="background:#99E599" title="normal"></td><td style="background:#99E599" title="normal"></td><td style="background:#99E599" title="normal"></td><td style="background:#E9E933" title="sticky"></td><td style="background:#226622" title="forest"></td><td style="background:#454FDF" title="water"></td><td style="background:#454FDF" title="water"></td><td style="background:#E9E933" title="sticky"></td><td style="background:#99E599" title="normal"></td><td style="background:#99E599" title="normal"></td><td style="background:#99E599" title="normal"></td></tr><tr style="min-height:24px;height:24px"><td align="center"><b>D</b></td><td style="background:#99E599" title="normal"></td><td style="background:#99E599" title="normal"></td><td style="background:#E9E933" title="sticky"></td><td style="background:#E9E933" title="sticky"></td><td style="background:#226622" title="forest"></td><td style="background:#226622" title="forest"></td><td style="background:#454FDF" title="water"></td><td style="background:#E9E933" title="sticky"></td><td style="background:#E9E933" title="sticky"></td><td style="background:#99E599" title="normal"></td><td style="background:#99E599" title="normal"></td></tr><tr style="min-height:24px;height:24px"><td align="center"><b>E</b></td><td style="background:#99E599" title="normal"></td><td style="background:#454FDF" title="water"></td><td style="background:#454FDF" title="water"></td><td style="background:#454FDF" title="water"></td><td style="background:#226622" title="forest"></td><td style="background:#99E599" title="normal"></td><td style="background:#226622" title="forest"></td><td style="background:#226622" title="forest"></td><td style="background:#226622" title="forest"></td><td style="background:#99E599" title="normal"></td><td style="background:#99E599" title="normal"></td></tr><tr style="min-height:24px;height:24px"><td align="center"><b>F</b></td><td style="background:#99E599" title="normal"></td><td style="background:#99E599" title="normal"></td><td style="background:#454FDF" title="water"></td><td style="background:#226622" title="forest"></td><td style="background:#99E599" title="normal"></td><td style="background:#99E599" title="normal"></td><td style="background:#99E599" title="normal"></td><td style="background:#226622" title="forest"></td><td style="background:#454FDF" title="water"></td><td style="background:#99E599" title="normal"></td><td style="background:#99E599" title="normal"></td></tr><tr style="min-height:24px;height:24px"><td align="center"><b>G</b></td><td style="background:#99E599" title="normal"></td><td style="background:#99E599" title="normal"></td><td style="background:#226622" title="forest"></td><td style="background:#226622" title="forest"></td><td style="background:#226622" title="forest"></td><td style="background:#99E599" title="normal"></td><td style="background:#226622" title="forest"></td><td style="background:#454FDF" title="water"></td><td style="background:#454FDF" title="water"></td><td style="background:#454FDF" title="water"></td><td style="background:#99E599" title="normal"></td></tr><tr style="min-height:24px;height:24px"><td align="center"><b>H</b></td><td style="background:#99E599" title="normal"></td><td style="background:#99E599" title="normal"></td><td style="background:#E9E933" title="sticky"></td><td style="background:#E9E933" title="sticky"></td><td style="background:#454FDF" title="water"></td><td style="background:#226622" title="forest"></td><td style="background:#226622" title="forest"></td><td style="background:#E9E933" title="sticky"></td><td style="background:#E9E933" title="sticky"></td><td style="background:#99E599" title="normal"></td><td style="background:#99E599" title="normal"></td></tr><tr style="min-height:24px;height:24px"><td align="center"><b>I</b></td><td style="background:#99E599" title="normal"></td><td style="background:#99E599" title="normal"></td><td style="background:#99E599" title="normal"></td><td style="background:#E9E933" title="sticky"></td><td style="background:#454FDF" title="water"></td><td style="background:#454FDF" title="water"></td><td style="background:#226622" title="forest"></td><td style="background:#E9E933" title="sticky"></td><td style="background:#99E599" title="normal"></td><td style="background:#99E599" title="normal"></td><td style="background:#99E599" title="normal"></td></tr><tr style="min-height:24px;height:24px"><td align="center"><b>J</b></td><td style="background:#99E599" title="normal"></td><td style="background:#99E599" title="normal"></td><td style="background:#99E599" title="normal"></td><td style="background:#99E599" title="normal"></td><td style="background:#454FDF" title="water"></td><td style="background:#99E599" title="normal"></td><td style="background:#99E599" title="normal"></td><td style="background:#99E599" title="normal"></td><td style="background:#99E599" title="normal"></td><td style="background:#99E599" title="normal"></td><td style="background:#99E599" title="normal"></td></tr><tr style="min-height:24px;height:24px"><td align="center"><b>K</b></td><td style="background:#99E599" title="normal"></td><td style="background:#99E599" title="normal"></td><td style="background:#99E599" title="normal"></td><td style="background:#99E599" title="normal"></td><td style="background:#99E599" title="normal"></td><td style="background:#99E599" title="normal"></td><td style="background:#99E599" title="normal"></td><td style="background:#99E599" title="normal"></td><td style="background:#99E599" title="normal"></td><td style="background:#99E599" title="normal"></td><td style="background:#99E599" title="normal" align="center"><b style="color:#00A000">P1</b></td></tr></table></div></details><details open><summary>Player Data</summary><div style="overflow-x:auto"><table align="center" style="border-spacing:0px;border-collapse:collapse;border:1px solid #888; background:rgba(120, 120, 225, 0.10)" cellpadding="3" border="1" bordercolor="#888"><col width="22"><col><col><col><col width="22"><col width="22"><col width="22"><col width="22"><col width="22"><tr style="height:22px"><th>#</th><th>Name</th><th>Class/Weapon</th><th>HP</th><th>A</th><th>M</th><th>PE</th><th>ME</th><th>MP</th></tr><tr style="height:22px"><th><b style="color:#00A000">P1</b></th><th>mymemoryisbad</th><th>CryoKinetic(8)/Tomahawk(9)</th><th>140/140</th><th>20</th><th>15</th><th>3</th><th>3</th><th>5</th></tr><tr style="height:22px"><th><b style="color:#0000C0">P2</b></th><th>4-mat</th><th>Rifter(10)/Wand(10)</th><th>125/125</th><th>16</th><th>19</th><th>2</th><th>2</th><th>4</th></tr><tr style="min-height:22px"><td colspan="9"  style="max-width:1px;text-align:center"><b>Turn Order: mymemoryisbad (B), 4-mat (A)</b></td></tr></table></div></details></div><button name="send" value="/msgroom boxbattles, %info &#10; /msgroom boxbattles, %cut 1">Watch</button><br>';
		return this.say(room, text);
	},
	calc: function(arg, user, room){
		arg = arg.replace("^","**");
		var regCheck = /[a-zA-Z]/g;
		return this.say(room, !regCheck.test(arg) ? eval(arg) : "");
	},
	solve: function(arg, user, room){
		let regCheck = /[a-zA-Z]/g;
		function onlyUnique(value, index, self) {
			return self.indexOf(value) === index;
		};
		let matches = arg.match(regCheck);
		matches = (matches !== null ? matches.filter(onlyUnique) : matches);
		if (!matches || matches.length === 0) { // no variable cases
			try { 
				let pass = arg + "= x";
				let solution = nerdamer.solve(pass, "x").toString();
				return this.say(room,(solution !== null ? solution.slice(1,-1) : "No solution found"));
			} catch (err) {
				return this.say(room, (err !== null ? err.message : "No solution found"));
			}
		}
		if (!matches || matches.length !== 1){ // multiple variable cases
			return this.say(room, (matches !== null ? matches.length : "No") + " variables found; 1 expected.");
		};
		try { // one variable cases
			let solution = nerdamer.solve(arg, matches).toString();
			return this.say(room,(solution !== null ? solution.slice(1,-1) : "No solution found"));
		} catch (err) {
			return this.say(room, (err !== null ? err.message : "No solution found"));
		}
	}
};
