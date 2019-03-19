import { INewCommandConfig } from "../model";

export const indexTemplate = ({dir, lit}: INewCommandConfig) => `<!DOCTYPE html>
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