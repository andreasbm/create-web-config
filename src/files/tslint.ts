import { INewCommandConfig } from "../model";

export const tslintTemplate = (config: INewCommandConfig) => `{
  "extends": "./node_modules/@appnest/web-config/tsconfig.json"
}`;