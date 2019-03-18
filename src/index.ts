import * as program from "commander";
import pkg from "./../package.json";
import { newCommand } from "./new";

program
	.version(pkg.version);

program
	.command("new <dir>")
	.description("Setup a new project from scratch.")
	.option(`-d, --dry`, `Runs the command without writing any files.`)
	.action((dir, cmd) => {
		newCommand({dir, dry: cmd.dry}).then();
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
