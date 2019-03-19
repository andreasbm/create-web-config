import { INewCommandConfig } from "../model";

export const packageTemplate = ({dir}: INewCommandConfig) => `{
	${dir != "" ? `"name": "${dir}",` : ""}
	"scripts": {
		"b:dev": "rollup -c rollup.config.ts --environment NODE_ENV:dev",
		"b:prod": "rollup -c rollup.config.ts --environment NODE_ENV:prod",
		"s:dev": "rollup -c rollup.config.ts --watch --environment NODE_ENV:dev",
		"s:prod": "rollup -c rollup.config.ts --watch --environment NODE_ENV:prod",
		"s": "npm run s:dev",
		"test": "karma start karma.conf.js"
	}
}`;