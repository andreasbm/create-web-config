export interface INewCommandOptions {
	dir: string;
	dry: boolean;
	lit: boolean;
	install: boolean;
	sw: boolean;
	dist: string;
	src: string;
}

export interface INewCommandConfig extends INewCommandOptions {
	overwrite: boolean;
}