import { green } from "colors";
import { existsSync } from "fs-extra";
import { join, resolve } from "path";
import prompts from "prompts";
import { LIT_HOME_PAGE_FOLDER_NAME, names } from "./constants";
import { browsersListTemplate } from "./files/browserslist";
import { gitignoreTemplate } from "./files/gitignore";
import { homeElementScssTemplate } from "./files/home-element-scss";
import { homeElementTestTemplate } from "./files/home-element-test";
import { homeElementTsTemplate } from "./files/home-element-ts";
import { indexTemplate } from "./files/index";
import { karmaTemplate } from "./files/karma";
import { mainScssTemplate } from "./files/main-scss";
import { mainTsTemplate } from "./files/main-ts";
import { manifestTemplate } from "./files/manifest";
import { packageTemplate } from "./files/package";
import { readmeTemplate } from "./files/readme";
import { robotsTemplate } from "./files/robots";
import { rollupConfigTemplate } from "./files/rollup-config";
import { tsconfigTemplate } from "./files/tsconfig";
import { tslintTemplate } from "./files/tslint";
import { typingsTemplate } from "./files/typings";
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
 * Setup rollup.config.ts
 * @param config
 */
function setupRollupConfig (config: INewCommandConfig) {
	const content = rollupConfigTemplate(config);
	writeFile(names.ROLLUP_CONFIG_TS, content, config);
}

/**
 * Setup tslint.json
 * @param config
 */
function setupTslint (config: INewCommandConfig) {
	const content = tslintTemplate(config);
	writeFile(names.TS_LINT_JSON, content, config);
}

/**
 * Setup tsconfig.json
 * @param config
 */
function setupTsconfig (config: INewCommandConfig) {
	const content = tsconfigTemplate(config);
	writeFile(names.TS_CONFIG_JSON, content, config);
}

/**
 * Setup .browserslistrc
 * @param config
 */
function setupBrowserslist (config: INewCommandConfig) {
	const content = browsersListTemplate(config);
	writeFile(names.BROWSERSLISTRC, content, config);
}

// Step 6 - Setup karma.conf.js
function setupKarma (config: INewCommandConfig) {
	const content = karmaTemplate(config);
	writeFile(names.KARMA_CONFIG_JS, content, config);
}

/**
 * Add start and build scripts to package.json
 * @param config
 */
function setupScripts (config: INewCommandConfig) {
	const content = packageTemplate(config);
	writeFile(names.PACKAGE_JSON, content, config);
}

/**
 * Setup typings
 * @param config
 */
function setupTypings (config: INewCommandConfig) {
	const content = typingsTemplate(config);
	writeFile(names.TYPINGS_D_TS, content, config);
}

/**
 * Setup gitignore
 * @param config
 */
function setupGitIgnore (config: INewCommandConfig) {
	const content = gitignoreTemplate(config);
	writeFile(names.GITIGNORE, content, config);
}

/**
 * Setup base files.
 */
function setupBaseFiles (config: INewCommandConfig) {
	const {lit, src} = config;
	const mainScssContent = mainScssTemplate(config);
	const readmeMdContent = readmeTemplate(config);
	const robotsTxtContent = robotsTemplate(config);
	const indexContent = indexTemplate(config);
	const manifestJsonContent = manifestTemplate(config);
	const mainTsContent = mainTsTemplate(config);

	createDirectory(join(src, names.ASSETS), config);
	writeFile(join(src, names.ASSETS, names.MANIFEST_JSON), manifestJsonContent, config);
	writeFile(join(src, names.MAIN_TS), mainTsContent, config);
	writeFile(join(src, names.MAIN_SCSS), mainScssContent, config);
	writeFile(join(src, names.INDEX_HTML), indexContent, config);
	writeFile(join(src, names.ROBOTS_TXT), robotsTxtContent, config);
	writeFile(names.README_MD, readmeMdContent, config);

	// Write the lit specific files if necessary
	if (lit) {
		const homeElementTsContent = homeElementTsTemplate(config);
		const homeElementScssContent = homeElementScssTemplate(config);
		const homeElementTsTestContent = homeElementTestTemplate(config);

		writeFile(join(src, names.MAIN_TS), mainTsContent, config);
		writeFile(join(src, LIT_HOME_PAGE_FOLDER_NAME, names.HOME_ELEMENT_TS), homeElementTsContent, config);
		writeFile(join(src, LIT_HOME_PAGE_FOLDER_NAME, names.HOME_ELEMENT_SCSS), homeElementScssContent, config);
		writeFile(join(src, LIT_HOME_PAGE_FOLDER_NAME, names.HOME_ELEMENT_TEST_TS), homeElementTsTestContent, config);

	}
}

/**
 * Executes the new command.
 * @param options
 */
export async function newCommand (options: INewCommandOptions) {
	const {dir, install} = options;
	const config = await getNewCommandConfig(options);
	setupRollupConfig(config);
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
