import pkg from "./package.json";
import ts from '@wessberg/rollup-plugin-ts';
import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';
import resolve from 'rollup-plugin-node-resolve';

const rollupBuildConfig = {
	plugins: [
		resolve({
			modulesOnly: false
		}),
		json(),
		ts({
			transpiler: "babel"
		}),
		commonjs({
			include: "**/node_modules/**"
		})
	],
	external: [
		...Object.keys(pkg.dependencies || {}),
		...Object.keys(pkg.dependencies || {}),
		"child_process"
	],
	treeshake: false
};

const distPath = "dist";
const srcPath = "src";

export default {
	...rollupBuildConfig,
	input: `${srcPath}/index.ts`,
	output: [
		{
			file: `${distPath}/index.cjs.js`,
			format: "cjs",
			banner: "#! /usr/bin/env node"
		},
		{
			file: `${distPath}/index.esm.js`,
			format: "esm",
			banner: "#! /usr/bin/env node"
		}
	]
};