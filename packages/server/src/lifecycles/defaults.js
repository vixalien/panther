let defaultActions = {
	boot: () => {
		console.log('Booting a fresh Panther server');
	},
	listen: ({ port }) => {
		console.log('Listening on port: ', app);
	}
}

export default defaultActions;