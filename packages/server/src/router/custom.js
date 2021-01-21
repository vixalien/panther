let customRouter = (app, options = []) => {
	options.forEach(router => {
		router(app);
	})
}

export default customRouter;