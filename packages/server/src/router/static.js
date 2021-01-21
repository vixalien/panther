import path from 'path';
import debugs from 'debug';
import { static as routeStatic } from 'express';
import interpolate from '../helpers/interpolate';

let debug = debugs('@panther/server:static-routes');

let DEFAULT_ROUTES = {
	root: 'public'
}

let staticRouter = (router, options = {}) => {
	if (options === false) return;
	let routes = interpolate(DEFAULT_ROUTES, options);
	
	for (let url in routes) {
		let paths = [routes[url]].flat();

		if (url == 'root') url = '/'

		paths.forEach(dir => {
			debug('serving static path: ', dir, 'at: ', url);
			router.use(url, routeStatic(path.resolve(process.cwd(), dir)))
		})
	}
}

export default staticRouter;