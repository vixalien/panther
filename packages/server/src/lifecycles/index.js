import debug from 'debug';

import defaultActions from './defaults';

import interpolate from '../helpers/interpolate';

let log = console.log;
let debugs = debug('@panther/server:lifecycles');

let lifecycles = (app, actions = {}) => {
	// listen to express-defined events
	var oldEmit = app.emit;

  app.emit = function(...args) {
    runAction.apply(app, args);
    oldEmit.apply(app, args);
  }

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
	}

	app.lifecycle = (step, data) => {
		debug(step);

		runAction('before-' + step, data);
		runAction(step, data);
		runAction('after-' + step, data);
	}
}

export default lifecycles;