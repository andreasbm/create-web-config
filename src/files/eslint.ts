import { INewCommandConfig } from "../model";

export const eslintTemplate = (config: INewCommandConfig) => `{
  "extends": "./node_modules/@appnest/web-config/eslint.js"
}`;