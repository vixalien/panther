import express from 'express';

import applyMiddleware from './middleware';
import applyRouters from './router';
import initLifecycles from './lifecycles';

function server(options = {}) {
	// Build the app
  let app = express();
  initLifecycles(app, options.lifecycles);

  app.lifecycle('boot');
  applyMiddleware(app, options.middleware);
  applyRouters(app, options.router);
  app.lifecycle('end-boot');

  return app;
}

export default server;