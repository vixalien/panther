let version = require('../package.json').version;


let Versionstring = `@panther/cli v${version}`;

let Helpstring = `${Versionstring}

Usage:
	panther [command] [options]

Commands:
	- None for now

Options:
	--port -p      Specify the port to mount the app to
	--help -h      Print this help and exit
	--version -v   Print version and exit`

let Args = (data) => {
	var argv = require('minimist')(data , {
		alias: {
			port: 'p',
			version: 'v',
			help: 'h'
		}
	});

	if (argv.help) { console.log(Helpstring); process.exit() }
	if (argv.version) { console.log(Versionstring); process.exit() }

	return {
		port: parseInt(argv.port) || 8080
	};
}

module.exports = Args;