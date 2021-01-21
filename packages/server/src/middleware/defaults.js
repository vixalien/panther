// imports
import morgan from 'morgan'
import session from 'cookie-session'
import compression from 'compression'
import debugs from 'debug'
import { urlencoded } from 'express'
import interpolate from '../helpers/interpolate'

let debug = debugs('@panther/server:default-middleware');

let DEFAULTS = {
	compression,
	morgan,
	session,
	urlencoded
}

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
}

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
}

export default useDefaultMiddleware;