import { names, NPM_ID } from "../constants";
import { INewCommandConfig } from "../model";

export const rollupConfigTemplate = ({sw, dist, src, lit}: INewCommandConfig) => `import {resolve, join} from "path";
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
	dist: resolve(__dirname, "${dist}"),
	src: resolve(__dirname, "${src}"),
	src_assets: resolve(__dirname, "${src}/${names.ASSETS}"),
	dist_assets: resolve(__dirname, "${dist}/${names.ASSETS}")
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