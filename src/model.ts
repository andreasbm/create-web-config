export interface INewCommandOptions {
	dir: string;
	dry: boolean;
	lit: boolean;
	install: boolean;
	sw: boolean;
}

export interface INewCommandConfig extends INewCommandOptions {
	dist: string;
	src: string;
	overwrite: boolean;
}