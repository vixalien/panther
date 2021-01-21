import staticRouter from './static';
import customRouter from './custom';

let Router = (app, options = {}) => {
	if (options === false) return;
	customRouter(app, options.custom);
	staticRouter(app, options.static);
}

export default Router;