import { green } from "colors";
import { existsSync } from "fs-extra";
import { join, resolve } from "path";
import prompts from "prompts";
import { LIT_HOME_PAGE_FOLDER_NAME, names, NPM_ID } from "./constants";
import { createDirectory, installDependencies, writeFile } from "./helpers";
import { INewCommandConfig, INewCommandOptions } from "./model";

/**
 * Asks the user for input and returns a configuration object for the command.
 * @param options
 */
async function getNewCommandConfig (options: INewCommandOptions): Promise<INewCommandConfig> {
	const {dir} = options;
	const input = await prompts<"src" | "dist" | "overwrite">([
		{
			type: "text",
			name: "src",
			message: `What should we call the folder with your source code?`,
			initial: `src`
		},
		{
			type: "text",
			name: "dist",
			message: `What should we call the folder with the transpiled output?`,
			initial: `dist`
		},

		// Ugly cast warning, but the prompts library have some funky race condition bugs going on
		// if we want to ask for two different rounds of user input in a row.
		...(existsSync(resolve(process.cwd(), dir)) ? [{
			type: "confirm",
			name: "overwrite",
			message: `The directory "${dir}" already exists. Do you want to overwrite existing files?`,
			initial: true
		}] : [] as any)

	], {
		onCancel: () => {
			process.exit(1);
		}
	});

	return {overwrite: true, ...input, ...options};
}

/**
 * Setup rollup.config.js
 * @param config
 */
function setupRollup (config: INewCommandConfig) {
	const {lit, sw} = config;
	const content = `import {resolve, join} from "path";
import {
	defaultOutputConfig,
	defaultPlugins,
	defaultProdPlugins,
	defaultServePlugins,
	isProd,
	isServe${sw ? `,
	workbox` : ""}
} from "${NPM_ID}";

const folders = {
	dist: resolve(__dirname, "${config.dist}"),
	src: resolve(__dirname, "${config.src}"),
	src_assets: resolve(__dirname, "${config.src}/${names.ASSETS}"),
	dist_assets: resolve(__dirname, "${config.dist}/${names.ASSETS}")
};

const files = {
	main: join(folders.src, "${names.MAIN_TS}"),
	src_index: join(folders.src, "${names.INDEX_HTML}"),
	src_robots: join(folders.src, "${names.ROBOTS_TXT}"),
	dist_index: join(folders.dist, "${names.INDEX_HTML}"),
	dist_robots: join(folders.dist, "${names.ROBOTS_TXT}")${sw ? `,
	dist_service_worker: join(folders.dist, "${names.SERVICE_WORKER_JS}")` : ""}
};

export default {
	input: {
		main: files.main
	},
	output: [
		defaultOutputConfig({
			dir: folders.dist,
			format: "esm"
		})
	],
	plugins: [
		...defaultPlugins({
			cleanConfig: {
				targets: [
					folders.dist
				]
			},
			copyConfig: {
				resources: [
					[files.src_robots, files.dist_robots],
					[folders.src_assets, folders.dist_assets]
				]
			},
			htmlTemplateConfig: {
				${lit ? `polyfillConfig: {
					features: ["es", "template", "shadow-dom", "custom-elements"]
				},` : ""}
				template: files.src_index,
				target: files.dist_index,
				include: /main(-.*)?\\.js$/
			},
			importStylesConfig: {
				globals: ["${names.MAIN_SCSS}"]
			}
		}),

		// Serve
		...(isServe ? [
			...defaultServePlugins({
				dist: folders.dist
			})
		] : []),

		// Production
		...(isProd ? [
			...defaultProdPlugins({
				dist: folders.dist
			}),
		] : [])${sw ? `,
		workbox({
			mode: "generateSW",
			workboxConfig: {
				globDirectory: folders.dist,
				swDest: files.dist_service_worker,
				globPatterns: [ \`**/*.{js,png,html,css}\`]
			}
		})` : ""}
	],
	treeshake: isProd,
	context: "window"
}`;

	writeFile(names.ROLLUP_CONFIG_JS, content, config);
}

/**
 * Setup tslint.json
 * @param config
 */
function setupTslint (config: INewCommandConfig) {
	const content = `{
  "extends": "./node_modules/@appnest/web-config/tslint.json"
}`;

	writeFile(names.TS_LINT_JSON, content, config);
}

/**
 * Setup tsconfig.json
 * @param config
 */
function setupTsconfig (config: INewCommandConfig) {
	const content = `{
  "extends": "./node_modules/@appnest/web-config/tsconfig.json"
}`;

	writeFile(names.TS_CONFIG_JSON, content, config);
}

/**
 * Setup .browserslistrc
 * @param config
 */
function setupBrowserslist (config: INewCommandConfig) {
	const content = `last 2 Chrome versions
last 2 Safari versions
last 2 Firefox versions`;

	writeFile(names.BROWSERSLISTRC, content, config);
}

// Step 6 - Setup karma.conf.js
function setupKarma (config: INewCommandConfig) {
	const content = `const {defaultResolvePlugins, defaultKarmaConfig} = require("@appnest/web-config");
 
module.exports = (config) => {
  config.set({
    ...defaultKarmaConfig({
      rollupPlugins: defaultResolvePlugins()
    }),
    basePath: "${config.src}",
    logLevel: config.LOG_INFO
  });
};`;

	writeFile(names.KARMA_CONFIG_JS, content, config);
}

/**
 * Add start and build scripts to package.json
 * @param config
 */
function setupScripts (config: INewCommandConfig) {
	const {dir} = config;
	const content = `{
	${dir != "" ? `"name": "${dir}",` : ""}
	"scripts": {
		"b:dev": "rollup -c --environment NODE_ENV:dev",
		"b:prod": "rollup -c --environment NODE_ENV:prod",
		"s:dev": "rollup -c --watch --environment NODE_ENV:dev",
		"s:prod": "rollup -c --watch --environment NODE_ENV:prod",
		"s": "npm run s:dev",
		"test": "karma start karma.conf.js"
	}
}`;

	writeFile(names.PACKAGE_JSON, content, config);
}

/**
 * Setup typings
 * @param config
 */
function setupTypings (config: INewCommandConfig) {
	const content = `/// <reference path="node_modules/@appnest/web-config/typings.d.ts" />`;
	writeFile(names.TYPINGS_D_TS, content, config);
}

/**
 * Setup gitignore
 * @param config
 */
function setupGitIgnore (config: INewCommandConfig) {
	const content = `# See http://help.github.com/ignore-files/ for more about ignoring files.

.DS_Store
ec2-user-key-pair.pem
/tmp
env.json
package-lock.json

# compiled output
/dist

# dependencies
/node_modules
/functions/node_modules

# IDEs and editors
/.idea
.project
.classpath
.c9/
*.launch
.settings/
*.sublime-workspace

# IDE - VSCode
.vscode/*
!.vscode/settings.json
!.vscode/tasks.json
!.vscode/launch.json
!.vscode/extensions.json

# misc
/.sass-cache
/connect.lock
/coverage/*
/libpeerconnection.log
npm-debug.log
testem.log
logfile

# e2e
/e2e/*.js
/e2e/*.map

#System Files
.DS_Store
Thumbs.db
dump.rdb

/compiled/
/.idea/
/.cache/
/.rpt2_cache/
/.vscode/
*.log
/logs/
npm-debug.log*
/lib-cov/
/coverage/
/.nyc_output/
/.grunt/
*.7z
*.dmg
*.gz
*.iso
*.jar
*.rar
*.tar
*.zip
.tgz
.env
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
*.pem
*.p12
*.crt
*.csr
/node_modules/
/dist/
/documentation/`;

	writeFile(names.GITIGNORE, content, config);
}

/**
 * Setup base files.
 */
function setupBaseFiles (config: INewCommandConfig) {
	const {dir, lit, src, sw} = config;

	const registerSwContent = `

// Register the service worker
if ("serviceWorker" in navigator) {
	navigator.serviceWorker.register("/${names.SERVICE_WORKER_JS}").then(res => {
		console.log(\`Service worker registered\`, res);
	});
}`;

	// SASS
	const mainScssContent = `html { font-size: 14px; }`;

	const readmeMdContent = `# ${dir}
	
This project was built using the [create-web-config](https://github.com/andreasbm/create-web-config) CLI.
	
## Usage 

→ Run "npm run s" to serve your project.
→ Run "npm run b:dev" to build your project for development.
→ Run "npm run b:prod" to build your project for production.
→ Run "npm run test" to test the application.`;

	const robotsTxtContent = `User-agent: *
Allow: /`;

	// Index
	const indexContent = `<!DOCTYPE html>
<html lang="en">
<head>
	<base href="/">
	<title>${dir}</title>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<meta name="theme-color" content="#ffffff">
	<meta name="description" content="This project was generated using the 'npm init web-config' command">
	<link rel="manifest" href="/assets/manifest.json">
</head>
<body>
	<p>${dir}</p>
	${lit ? `<router-slot></router-slot>` : ""}
	
	<noscript>
		<p>Please enable Javascript in your browser.</p>
	</noscript>
</body>
</html>`;

	const manifestJsonContent = `{
    "name": "${dir}",
    "short_name": "${dir}",
    "theme_color": "#ffffff",
    "background_color": "#ffffff",
    "display": "standalone",
    "start_url": "/",
    "lang": "en-US",
    "icons": [
        {
            "src": "https://raw.githubusercontent.com/andreasbm/weightless/master/assets/www/android-chrome-192x192.png",
            "sizes": "192x192",
            "type": "image/png"
        },
        {
            "src": "https://raw.githubusercontent.com/andreasbm/weightless/master/assets/www/android-chrome-512x512.png",
            "sizes": "512x512",
            "type": "image/png"
        }
    ]
}`;

	createDirectory(join(src, names.ASSETS), config);
	writeFile(join(src, names.ASSETS, names.MANIFEST_JSON), manifestJsonContent, config);
	writeFile(join(src, names.MAIN_SCSS), mainScssContent, config);
	writeFile(join(src, names.INDEX_HTML), indexContent, config);
	writeFile(join(src, names.ROBOTS_TXT), robotsTxtContent, config);
	writeFile(names.README_MD, readmeMdContent, config);

	// Write the lit specific files or the default ones
	if (lit) {
		const mainTsContent = `import "main.scss";
import "@appnest/web-router";
import {RouterSlot} from "@appnest/web-router";

customElements.whenDefined("router-slot").then(async () => {
	const routerSlot = document.querySelector<RouterSlot>("router-slot")!;
	await routerSlot.add([
		{
			path: "home",
			component: () => import("./${LIT_HOME_PAGE_FOLDER_NAME}/home-element")
	    },
	    {
			path: "**",
			redirectTo: "home"
	    }
	]);
});${sw ? registerSwContent : ""}`;

		const homeElementTsContent = `import { customElement, html, LitElement, unsafeCSS } from "lit-element";
import css from "./home-element.scss";
import "weightless/button";

@customElement("home-element")
export default class HomeElement extends LitElement {
	static styles = [unsafeCSS(css)];

	render () {
		return html\`
			<wl-button>Welcome</wl-button>	
		\`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		"home-element": HomeElement;
	}
}`;

		const homeElementScssContent = `:host {
	color: red;
}`;

		const homeElementTsTestContent = `import "./home-element";
import HomeElement from "./home-element";

describe("home-element", () => {
	let {expect} = chai;
	let $elem: HomeElement;
	let $container: HTMLElement;

	before(() => {
		$container = document.createElement("div");
		document.body.appendChild($container);
	});
	beforeEach(async () => {
		$container.innerHTML = \`<home-element></home-element>\`;

		await window.customElements.whenDefined("home-element");
		$elem = $container.querySelector<HomeElement>("home-element")!;
	});
	after(() => $container.remove());

	it("should be able to be stamped into the DOM", () => {
		expect($elem).to.exist;
	});
});`;

		writeFile(join(src, names.MAIN_TS), mainTsContent, config);
		writeFile(join(src, LIT_HOME_PAGE_FOLDER_NAME, names.HOME_ELEMENT_TS), homeElementTsContent, config);
		writeFile(join(src, LIT_HOME_PAGE_FOLDER_NAME, names.HOME_ELEMENT_SCSS), homeElementScssContent, config);
		writeFile(join(src, LIT_HOME_PAGE_FOLDER_NAME, names.HOME_ELEMENT_TEST_TS), homeElementTsTestContent, config);

	} else {
		const mainTsContent = `import "main.scss";${sw ? registerSwContent : ""}`;
		writeFile(join(src, names.MAIN_TS), mainTsContent, config);
	}
}

/**
 * Executes the new command.
 * @param options
 */
export async function newCommand (options: INewCommandOptions) {
	const {dir, install} = options;
	const config = await getNewCommandConfig(options);
	setupRollup(config);
	setupTslint(config);
	setupTsconfig(config);
	setupBrowserslist(config);
	setupKarma(config);
	setupScripts(config);
	setupTypings(config);
	setupGitIgnore(config);
	setupBaseFiles(config);

	// Only install if specified
	if (install) {
		await installDependencies(config);
	}

	// Tell the user that everything worked!
	console.log(green(`✔ Finished creating project in "${resolve(process.cwd(), dir)}" 🎉`));
	console.log(`What's next?
  → Run "${green("npm run s")}" to serve your project.
  → Run "${green("npm run b:dev")}" to build your project for development.
  → Run "${green("npm run b:prod")}" to build your project for production.`);
}
