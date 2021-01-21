let defaultActions = {
	boot: () => {
		console.log('Booting a fresh Panther server');
	},
	listened: ({ port }) => {
		console.log('Listening on port: ', port);
	}
}

export default defaultActions;