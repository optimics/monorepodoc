# monorepodoc

Zeroconf [JSDoc](https://jsdoc.app/) wrapper with support for [redoc](https://github.com/Redocly/redoc) and mermaid that generates documentation for each of your monorepo projects and includes READMEs.

## Directories

```
monorepo/
├─ node_modules/      // Always ignored by default
├─ packages/          // Subpackages are expected here
│  ├─ docs/           // Markdown files from here are bundled into the docs package
│  ├─  ├─ anything.md
│  ├─ specs/
│  ├─  ├─ index.yaml  // Compiled with redoc and bundled in
│  ├─ package.json    // Meta information extracted, dependencies linked
│  ├─ README.md       // Bundled in
├─ package.json       // Meta information extracted
├─ README.md          // Bundled in
```

## Installation

```shell
npm install --save-dev @optimics/monorepodoc
```

Supports only Node.js >= 16

## Running

Monorepodoc will automatically resolve all of your monorepo packages and put build outputs into `dist/docs`.

```shell
monorepodoc
```

## Redoc support

Simply installing [redoc-cli](https://www.npmjs.com/package/redoc-cli) should get your specs automagically bundled.

```
npm install --save-dev redoc-cli
```

## Mermaid support

Simply installing [@mermaid-js/mermaid-cli](https://www.npmjs.com/package/@mermaid-js/mermaid-cli) should get your mermaid charts automagically rendered into PNGs.

```
npm install --asve-dev @mermaid-js/mermaid-cli
```
