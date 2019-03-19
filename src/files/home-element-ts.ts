import { INewCommandConfig } from "../model";

export const homeElementTsTemplate = (config: INewCommandConfig) => `import { customElement, html, LitElement, unsafeCSS } from "lit-element";
import css from "./home-element.scss";
import "weightless/button";

@customElement("home-element")
export default class HomeElement extends LitElement {
	static styles = [unsafeCSS(css)];

	render () {
		return html\`
			<wl-button>Welcome</wl-button>	
		\`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		"home-element": HomeElement;
	}
}`;