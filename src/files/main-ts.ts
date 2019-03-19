import { LIT_HOME_PAGE_FOLDER_NAME } from "../constants";
import { INewCommandConfig } from "../model";
import { registerSwTemplate } from "./register-sw";

const mainTsLitTemplate = (config: INewCommandConfig) => `import "main.scss";
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
});`;

const mainTsDetaulTemplate = (config: INewCommandConfig) => `import "main.scss";`;

export const mainTsTemplate = (config: INewCommandConfig) => {
	const {lit, sw} = config;

	return `${lit ? mainTsLitTemplate(config) : mainTsDetaulTemplate(config)}${sw ? `
	
${registerSwTemplate(config)}` : ""}`;
};
