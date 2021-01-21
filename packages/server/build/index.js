'use strict';

var express = require('express');
var morgan = require('morgan');
var session = require('cookie-session');
var compression = require('compression');
var debugs$1 = require('debug');
var path = require('path');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var express__default = /*#__PURE__*/_interopDefaultLegacy(express);
var morgan__default = /*#__PURE__*/_interopDefaultLegacy(morgan);
var session__default = /*#__PURE__*/_interopDefaultLegacy(session);
var compression__default = /*#__PURE__*/_interopDefaultLegacy(compression);
var debugs__default = /*#__PURE__*/_interopDefaultLegacy(debugs$1);
var path__default = /*#__PURE__*/_interopDefaultLegacy(path);

function interpolate (base = {}, extensions = {}) {
	return { ...base, ...extensions }
}

// imports

let debug = debugs__default['default']('@panther/server:default-middleware');

let DEFAULTS = {
	compression: compression__default['default'],
	morgan: morgan__default['default'],
	session: session__default['default'],
	urlencoded: express.urlencoded
};

let DEFAULT_OPTIONS = {
	compression: null,
	morgan: 'dev',
	session: {
	  signed: false,
	  httpOnly: false
	},
	urlencoded: {
		extended: true
	}
};

let useDefaultMiddleware = (app, options = {}) => {
	if(options == false) return;
	let middlewares = interpolate(DEFAULT_OPTIONS, options);

	for (let middleware in middlewares) {
		let value = middlewares[middleware];

		if (value === false) continue;

		if (!(middleware in DEFAULTS)) continue;

		debug('using middleware', middleware);
		app.use(DEFAULTS[middleware](value || null));
	}
};

let customMiddleware = (app, custom = []) => {
	if (custom === false) return;
	custom.forEach(middleware => {
		app.use(middleware);
	});
};

let useMiddleware = (app, options = {}) => {
	if(!options) return;

	customMiddleware(app, options.custom);
	useDefaultMiddleware(app, options.defaults);
};

let debug$1 = debugs__default['default']('@panther/server:static-routes');

let DEFAULT_ROUTES = {
	root: 'public'
};

let staticRouter = (router, options = {}) => {
	if (options === false) return;
	let routes = interpolate(DEFAULT_ROUTES, options);
	
	for (let url in routes) {
		let paths = [routes[url]].flat();

		if (url == 'root') url = '/';

		paths.forEach(dir => {
			debug$1('serving static path: ', dir, 'at: ', url);
			router.use(url, express['static'](path__default['default'].resolve(process.cwd(), dir)));
		});
	}
};

let customRouter = (app, options = []) => {
	options.forEach(router => {
		router(app);
	});
};

let Router = (app, options = {}) => {
	if (options === false) return;
	customRouter(app, options.custom);
	staticRouter(app, options.static);
};

let defaultActions = {
	boot: () => {
		console.log('Booting a fresh Panther server');
	},
	listen: ({ port }) => {
		console.log('Listening on port: ', app);
	}
};

let debugs = debugs__default['default']('@panther/server:lifecycles');

let lifecycles = (app, actions = {}) => {
	let runAction = (step, data = {}) => {
		// also add app
		data.app = app;

		let customAction = actions[step];
		let defaultAction = defaultActions[step];

		if (customAction) {
			if (defaultActions) {
				if (defaultAction.bypass || customAction.allowBypass) {
					defaultAction(data);
					customAction(data);
				} else {
					customAction(data);
				}
			} else {
				customAction(data);
			}
		} else if(defaultAction) {
			defaultAction(data);
		}
	};

	app.lifecycle = (step, data) => {
		debugs__default['default'](step);

		runAction('before-' + step, data);
		runAction(step, data);
		runAction('after-' + step, data);
	};
};

function server(options = {}) {
	// Build the app
  let app = express__default['default']();
  lifecycles(app, options.lifecycles);

  app.lifecycle('boot');
  useMiddleware(app, options.middleware);
  Router(app, options.router);
  app.lifecycle('end-boot');

  return app;
}

module.exports = server;
