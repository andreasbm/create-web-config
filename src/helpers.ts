import { exec } from "child_process";
import { green } from "colors";
import { existsSync, mkdirpSync, outputFileSync } from "fs-extra";
import ora from "ora";
import { join, resolve } from "path";
import { INewCommandConfig } from "./model";

/**
 * Install dependencies.
 * @param deps
 * @param development
 * @param dir
 */
export async function install (deps: string[],
                               {development = false, dir = ""}: Partial<{development: boolean, dir: string}>) {
	await run(`cd ${resolve(process.cwd(), dir)} && npm i ${deps.join(" ")} ${development ? `-D` : ""}`);
}

/**
 * Writes a file to the correct path.
 * @param name
 * @param content
 * @param config
 */
export function writeFile (name: string, content: string, config: INewCommandConfig) {
	const path = join(resolve(process.cwd(), config.dir), name);

	// Check if the file exists and if we should then abort
	if (!config.overwrite && existsSync(path)) {
		return;
	}

	console.log(green(`✔ Creating "${name}"`));

	// Check if the command is dry.
	if (config.dry) {
		console.log(content);
		return;
	}

	outputFileSync(path, content);
}

/**
 * Creates a directory.
 * @param dir
 * @param config
 */
export function createDirectory (dir: string, config: INewCommandConfig) {
	console.log(green(`✔ Creating directory "${dir}"`));

	// Check if the command is dry.
	if (config.dry) {
		return;
	}

	const path = resolve(process.cwd(), join(config.dir, dir));
	mkdirpSync(path);
}

/**
 * Runs a command.
 * @param cmd
 */
export function run (cmd: string): Promise<void> {
	return new Promise((res, rej) => {
		exec(cmd, error => {
			if (error !== null) {
				return rej(error);
			}

			res();
		});
	});
}

/**
 * Install dependencies.
 * @param dry
 * @param lit
 * @param dir
 */
export async function installDependencies ({dry, lit, dir}: INewCommandConfig) {
	const spinner = ora(green(`︎Installing dependencies...`)).start();

	function finish () {
		spinner.succeed(green(`Finished installing dependencies`));
	}

	// Check if the command is dry
	if (dry) {
		finish();
		return;
	}

	// Run the command
	try {
		await install(["@appnest/web-config"], {dir, development: true});

		// Install lit related dependencies
		if (lit) {
			await install([
				"@appnest/web-router",
				"lit-element",
				"weightless"
			], {dir});
		}

		finish();

	} catch (err) {
		spinner.warn(`Could not install dependencies: ${err.message}`);
	}
}