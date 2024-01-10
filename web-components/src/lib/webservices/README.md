# Javascript / Typescript development

We use a mix of vanilla Javascript components and Typescript/[Lit element](https://lit.dev/) included in server side rendered django templates. Newer components are written in Lit where possible, with the goal of migrating all front end code lit and TS.

## Developing with Typescript / lit

All lit components, which are written in typescript, plus any additional typescript needed for composing and connecting components, lives in the `./src/` directory.

Before the typescript can be run, it has to be compiled to javascript and bundled together with any dependencies into a single file: `./dist/index.js`. We use `rollup` to do the bundling, which also takes care of the Typescript compilation.

### Bundling as you develop

Running `make dev-bundle` within this directory will startup an rollup bundling process that will watch your typescript files and
automatically recompile when it detects any changes.

### Committing the bundled asset

To simplify the deployment process, the bundle at `./dist/index.js` is committed to the git repo. You should run `make bundle` before committing the changes to `index.js` so that a minified, version of the file is what we ship and use in production.

### Tests

Lit web components [should be tested in a real browser](https://lit.dev/docs/tools/testing/#testing-in-the-browser), so we run ts/js tests with [`@web/test-runner`](https://modern-web.dev/guides/test-runner/getting-started/) which in turn leverages [`playwright`](https://playwright.dev/docs/browsers) to use run the tests in chromium. Other browsers (WebKit and Firefox) are available from `playwright`, but were a but inconsistent across dev environments, so we stayed limited the tests to Chromium for now.

## Creating new TS/lit components

The `make component` target is provided to make scaffolding a new component easy. It uses the [Internet Archive Typescript WebComponent Template](https://github.com/internetarchive/iaux-typescript-wc-template), but removes some of the added files needed to have a component be a standalone repo.

When calling the target, include the `NAME=my-web-component`, like:

```bash
make component NAME=my-web-component
```

This will create a new directory for your component, an index.ts that exports your new component, a src dir with a stub of your component, and and test dir that has some basic tests you'll want to replace, but are good enough to get you started. The structure looks like:

```bash
my-web-component/
├── index.ts
├── src
│   └── my-web-component.ts
└── test
    └── my-web-component.test.ts
```
