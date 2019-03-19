import * as program from "commander";
import pkg from "./../package.json";
import { newCommand } from "./new";

program
	.version(pkg.version);

program
	.command("new <dir>")
	.description("Setup a new project from scratch.")
	.option(`-d, --dry`, `Runs the command without writing any files.`)
	.option(`-l, --lit`, `Adds lit-element and various webapp related libraries to the setup.`)
	.option(`-n, --no-install`, `Doesn't install node_modules.`)
	.option(`-s, --sw`, `Adds a service worker to the setup.`)
	.action((dir, cmd) => {
		const {dry, lit, install, sw} = cmd;
		newCommand({dir, dry, lit, install, sw}).then();
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
