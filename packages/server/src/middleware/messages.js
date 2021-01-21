let MessageMiddleware = (app) => {
	// define a custom res.message() method
	// which stores messages in the session
	app.response.message = function(msg){
		// reference `req.session` via the `this.req` reference
		var sess = this.req.session;
		// simply add the msg to an array for later
		sess.messages = sess.messages || [];
		sess.messages.push(msg);
		return this;
	};

	// expose the "messages" local variable when views are rendered
	app.use(function(req, res, next){
		var msgs = req.session.messages || [];

		// expose "messages" local variable
		res.locals.messages = msgs;

		// expose "hasMessages"
		res.locals.hasMessages = !! msgs.length;

		next();
		// empty or "flush" the messages so they
		// don't build up
		req.session.messages = [];
	});
}

export default MessageMiddleware;