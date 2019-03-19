import { names } from "../constants";
import { INewCommandConfig } from "../model";

export const registerSwTemplate = (config: INewCommandConfig) => `// Register the service worker
if ("serviceWorker" in navigator) {
	navigator.serviceWorker.register("/${names.SERVICE_WORKER_JS}").then(res => {
		console.log(\`Service worker registered\`, res);
	});
}`;
