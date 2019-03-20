import * as program from "commander";
import pkg from "./../package.json";
import { DIST_FOLDER_NAME, SRC_FOLDER_NAME } from "./constants";
import { newCommand } from "./new";

program
	.version(pkg.version);

program
	.command("new <dir>")
	.description("Setup a new project from scratch.")
	.option(`--dry`, `Runs the command without writing any files.`)
	.option(`--lit`, `Adds lit-element and various webapp related libraries to the setup.`)
	.option(`--no-install`, `Doesn't install node_modules.`)
	.option(`--sw`, `Adds a service worker to the setup.`)
	.option(`--src <string>`, `Name of the folder with the transpiled output`, SRC_FOLDER_NAME)
	.option(`--dist <string>`, `Name of the folder with the source code`, DIST_FOLDER_NAME)
	.action((dir, cmd) => {
		const {dry, lit, install, sw, src, dist} = cmd;
		newCommand({dir, dry, lit, install, sw, src, dist}).then();
	});

// Do some error handling
const userArgs = process.argv.slice(2);
if (userArgs.length === 0) {
	program.help();
}

// Handle unknown commands
program.on("command:*", () => {
	console.error(`Invalid command: ${userArgs.join(" ")}\nSee --help for a list of available commands.`);
	process.exit(1);
});

// Parse the input
program.parse(process.argv);
