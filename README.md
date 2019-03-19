<h1 align="center">create-web-config</h1>
<p align="center">
		<a href="https://npmcharts.com/compare/create-web-config?minimal=true"><img alt="Downloads per month" src="https://img.shields.io/npm/dm/create-web-config.svg" height="20"/></a>
<a href="https://www.npmjs.com/package/create-web-config"><img alt="NPM Version" src="https://img.shields.io/npm/v/create-web-config.svg" height="20"/></a>
<a href="https://david-dm.org/andreasbm/create-web-config"><img alt="Dependencies" src="https://img.shields.io/david/andreasbm/create-web-config.svg" height="20"/></a>
<a href="https://github.com/andreasbm/create-web-config/graphs/contributors"><img alt="Contributors" src="https://img.shields.io/github/contributors/andreasbm/create-web-config.svg" height="20"/></a>
	</p>

<p align="center">
  <b>A CLI to help you get started building modern web applications.</b></br>
  <sub><sub>
</p>

<br />


<p align="center">
	<img src="https://raw.githubusercontent.com/andreasbm/create-web-config/master/example.gif" width="600">
</p>


[![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/colored.png)](#usage)

## ➤ Usage

To create a new app you run the following command.

```
$ npm init web-config new <dir>
```

This command will create a project from scratch for you with sweet features as for example SCSS imports, Karma testing, live reloading, coping resources, chunking, treeshaking, Typescript, license extraction, filesize visualizer, JSON import, budgets, build progress, minifying, compression with brotli and gzip and much more.

That's it! Behind the curtains, the library [web-config](https://github.com/andreasbm/web-config) is used.


[![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/colored.png)](#configuration)

## ➤ Configuration

The below table shows how to configure the new command.

```
Usage: new [options] <dir>

Setup a new project from scratch.

Options:
  -d, --dry     Runs the command without writing any files.
  -l, --lit     Adds lit-element and various webapp related libraries to the setup.
  --no-install  Doesn't install node_modules.
  --sw          Adds a service worker to the setup.
  -h, --help    output usage information
```


[![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/colored.png)](#example)

## ➤ Example

Below are two examples on how to use the command. The commands will both create a project in a folder called "my-project". The first one will create a simple configuration while the other will configure the project to use [lit-element](https://github.com/Polymer/lit-element).

```
$ npm init web-config new my-project
$ npm init web-config new my-project -lit
```


[![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/colored.png)](#overview)

## ➤ Overview

Here's an overview of the files that are generated for you.


| File                             | Description                                      |
|----------------------------------|--------------------------------------------------|
| `.browserslistrc`                | Specifies which browsers are supported by your build. |
| `.gitignore`                     | Files ignored when adding files to git.          |
| `karma.conf.js`                  | Configuration for the testing setup with karma.  |
| `package.json`                   | Specifies dependencies and other information about your project. |
| `README.md`                      | Gives an introduction to your project.           |
| `rollup.config.js`               | Rollup configuration for the build steps.        |
| `tsconfig.json`                  | Configuration for Typescript.                    |
| `tslint.json`                    | Configuration for how your files should be linted. |
| `typings.d.ts`                   | Additional typings for Typescript.               |
| `src/index.html`                 | Entry HTML for your webapp.                      |
| `src/main.ts`                    | Entry JS for your webapp.                        |
| `src/main.scss`                  | Styles loaded and appended to the document.      |
| `src/robots.txt`                 | Specifies how crawlers should handle your site.  |
| `src/assets/manifest.json`       | Web manifest.                                    |
| `src/pages/home-element.ts`      | Element for the home page.                       |
| `src/pages/home-element.scss`    | SCSS for the home element.                       |
| `src/pages/home-element.test.ts` | Tests for the home element.                      |



[![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/colored.png)](#100100-lighthouse-score)

## ➤ 100/100 Lighthouse score

If you add a service worker by running the `$ npm init web-config new my-project --sw` command you'll get to enjoy a 100/100 Lighthouse score from the beginning.

<img src="https://raw.githubusercontent.com/andreasbm/create-web-config/master/lighthouse.png" width="500">


[![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/colored.png)](#local-installation)

## ➤ Local installation

You can also install the library locally and use the CLI you can run the following command.

```
$ npm i create-web-config
```

Then you would use the CLI like this.

```
$ web-config new my-project
```


[![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/colored.png)](#contributors)

## ➤ Contributors
	

| [<img alt="Andreas Mehlsen" src="https://avatars1.githubusercontent.com/u/6267397?s=460&v=4" width="100">](https://twitter.com/andreasmehlsen) |
|:--------------------------------------------------:|
| [Andreas Mehlsen](https://twitter.com/andreasmehlsen) |


[![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/colored.png)](#license)

## ➤ License
	
Licensed under [MIT](https://opensource.org/licenses/MIT).