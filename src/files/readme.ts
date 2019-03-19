import { INewCommandConfig } from "../model";

export const readmeTemplate = ({dir}: INewCommandConfig) => `# ${dir}
	
This project was built using the [create-web-config](https://github.com/andreasbm/create-web-config) CLI.
	
## Usage 

* Run \`npm run s\` to serve your project.
* Run \`npm run b:dev\` to build your project for development.
* Run \`npm run b:prod\` to build your project for production.
* Run \`npm run test\` to test the application.`;
