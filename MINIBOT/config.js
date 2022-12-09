// The WEBSOCKET server and port the bot should connect to.
// Most of the time this isn't the same as the URL, check the `Request URL` of
// the websocket.
// If you really don't know how to do this... Run `node getserver.js URL`.
// Fill in the URL of the client where `URL` is.
// For example: `node getserver.js http://example-server.psim.us/`
exports.server = "sim3.psim.us" // "server.dawn-ps.com";
exports.port = 80 // 8080;

// This is the server id.
// To know this one, you should check where the AJAX call 'goes' to when you
// log in.
// For example, on the Smogon server, it will say somewhere in the URL
// ~~showdown, meaning that the server id is 'showdown'.
// If you really don't know how to check this... run the said script above.
exports.serverid = "showdown";

// The nick and password to log in with
// If no password is required, leave pass empty
exports.nick = 'LifeHaxGamer';
exports.pass = 'lifelife';

// The rooms that should be joined.
// Joining Smogon's Showdown's Lobby is not allowed.
exports.rooms = ['bd','botdev'];

// Any private rooms that should be joined.
// Private rooms will be moderated differently (since /warn doesn't work in them).
// The bot will also avoid leaking the private rooms through .seen
exports.privaterooms = ['groupchat-lifehaxgamer-test'];

// The character text should start with to be seen as a command.
// Note that using / and ! might be 'dangerous' since these are used in
// Showdown itself.
// Using only alphanumeric characters and spaces is not allowed.
exports.commandcharacter = 'do ';

// The default rank is the minimum rank that can use a command in a room when
// no rank is specified in settings.json
exports.defaultrank = '%';

// The server's usergroups, in order from lowest to highest priority.
exports.groups = {
	' ': 0,
	'+': 1,
	'%': 2,
	'@': 3,
	'*': 3.5,
	'#': 4,
	'&': 5,
	'~': 6
};

// Whether this file should be watched for changes or not.
// If you change this option, the server has to be restarted in order for it to
// take effect.
exports.watchconfig = false;

// Secondary websocket protocols should be defined here, however, Showdown
// doesn't support that yet, so it's best to leave this empty.
exports.secprotocols = [];

// What should be logged?
// 0 = error, ok, info, debug, recv, send
// 1 = error, ok, info, debug, cmdr, send
// 2 = error, ok, info, debug (recommended for development)
// 3 = error, ok, info (recommended for production)
// 4 = error, ok
// 5 = error
exports.debuglevel = 0;

// Users who can use all commands regardless of their rank. Be very cautious
// with this, especially on servers other than main.
exports.excepts = ['4mat','shubname','lifehaxgamer','foreverflame','kyot0','bro torterra','mafiassatan','omnisans','boicamer','somethin9112','outm','skirmpend','kaiser747898'];

// Whitelisted users are those who the bot will not enforce moderation for.
exports.whitelist = ['mmm', 'afkmmm', 'taistelu', 'convalesce', 'vulcaron', 'asthmeresivolisk', 'microwavable', 'busytai', 'hirl123', 'moq', 'henka', 'wonto','sawanosama','wontowonders','maillog','shakujil','credstik','kiminonawa'];

// Users in this list can use the regex autoban commands. Only add users who know how to write regular expressions and have your complete trust not to abuse the commands.
exports.regexautobanwhitelist = [];

// Add a link to the help for the bot here. When there is a link here, .help and .guide
// will link to it.
exports.botguide = 'docs.google.com/document/d/1PKLQzJzym0kAO57IlulDXpvJPwKR7FCrao9upTSUSRg/edit';

// Add a link to the git repository for the bot here for .git to link to.
exports.fork = 'Taistelu sucks :)';

// This allows the bot to act as an automated moderator. If enabled, the bot will
// mute users who send 6 lines or more in 6 or fewer seconds for 7 minutes. NOTE: THIS IS
// BY NO MEANS A PERFECT MODERATOR OR SCRIPT. It is a bot and so cannot think for itself or
// exercise moderator discretion. In addition, it currently uses a very simple method of 
// determining who to mute and so may miss people who should be muted, or mute those who 
// shouldn't. Use with caution.
exports.allowmute = true; //via request from MMM - Vulcaron

// The punishment values system allows you to customise how you want the bot to deal with
// rulebreakers. Spamming has a points value of 2, all caps has a points value of 1, etc.
exports.punishvals = {
	1: 'warn',
	2: 'mute',
	3: 'hourmute',
	4: 'roomban',
	5: 'ban'
};

//This key is used to deliver requests from Google Spreadsheets. Used by the wifi room.
exports.googleapikey = '';

//Here, you specify the avatar you want the bot to use. Nice and handy if you don't want it to constantly have the default avatar.
exports.avatarNumber = [287];
