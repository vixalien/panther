import defaultMiddleware from './defaults';
import interpolate from '../helpers/interpolate';

let customMiddleware = (app, custom = []) => {
	if (custom === false) return;
	custom.forEach(middleware => {
		app.use(middleware);
	});
}

let useMiddleware = (app, options = {}) => {
	if(!options) return;

	customMiddleware(app, options.custom);
	defaultMiddleware(app, options.defaults);
}

export default useMiddleware;