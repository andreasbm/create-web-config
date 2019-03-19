import { INewCommandConfig } from "../model";

export const tsconfigTemplate = (config: INewCommandConfig) => `{
  "extends": "./node_modules/@appnest/web-config/tsconfig.json"
}`;