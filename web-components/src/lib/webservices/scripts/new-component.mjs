import degit from "degit";
import { pascalCase, paramCase } from "change-case";
import { exec } from "child_process";
import { rename } from "fs";
import replaceInFile from "replace-in-file";

//
// This script creates a new web component based on the IAUX typescript
// web component template, but with a few alterations:
// 1) takes a name as a parameter and uses that name to update names of
//    files, classes, variables, tests, etc. so that does not need to be done
//    manually
// 2) Deletes files from the template that are not required in the application
//    context.

const name = process.argv[2];

const PARAM_NAME = paramCase(name);
const PASCAL_NAME = pascalCase(name);

const SOURCE = "internetarchive/iaux-typescript-wc-template";
const DEST_DIR = `./src/${PARAM_NAME}`;

const emitter = degit(SOURCE, {
  cache: true,
  force: true,
  verbose: true,
});

emitter.clone(DEST_DIR).then(() => {
  removeTemplateCruft();
  renameFilesWithProvidedName();
  replaceTemplateNameWithProvidedName();
});

function renameFilesWithProvidedName() {
  [
    {
      from: `${DEST_DIR}/src/your-webcomponent.ts`,
      to: `${DEST_DIR}/src/${PARAM_NAME}.ts`,
    },
    {
      from: `${DEST_DIR}/test/your-webcomponent.test.ts`,
      to: `${DEST_DIR}/test/${PARAM_NAME}.test.ts`,
    },
  ].forEach((renaming) => {
    rename(renaming.from, renaming.to, (err) => {
      if (err) {
        throw err;
      }
    });
  });
}

function removeTemplateCruft() {
  // Remove cruft from the solo repo template
  const filesToRemove = [
    ".github",
    ".editorconfig",
    ".gitignore",
    ".husky",
    "LICENSE",
    "yarn.lock",
    "web-dev-server.config.mjs",
    "web-test-runner.config.mjs",
    "package.json",
    "tsconfig.json",
    "README.md",
    "demo/",
    "renovate.json",
  ].join(",");

  exec(`rm -rf ${DEST_DIR}/{${filesToRemove}}`);
}

function replaceTemplateNameWithProvidedName() {
  const files = [
    `${DEST_DIR}/src/${PARAM_NAME}.ts`,
    `${DEST_DIR}/test/${PARAM_NAME}.test.ts`,
    `${DEST_DIR}/index.ts`,
  ];

  const textReplace = [
    { from: /YourWebComponent/g, to: PASCAL_NAME },
    { from: /your-webcomponent/g, to: PARAM_NAME },
  ];

  textReplace.forEach((term) => {
    const options = {
      files: files,
      from: term.from,
      to: term.to,
      countMatches: true,
    };

    try {
      replaceInFile.sync(options);
    } catch (error) {
      console.error("Error occurred:", error);
    }
  });
}
