import external from "rollup-plugin-auto-external";
import resolve from "@rollup/plugin-node-resolve";

export default [
	// Build hydrate function
	{
		input: 'src/server.js',
		output: {
			file: 'build/index.js',
			format: 'cjs',
		},
		plugins: [
			resolve(),
			external()
		]
	},
]