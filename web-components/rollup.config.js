import typescript from "@rollup/plugin-typescript";
import resolve from "@rollup/plugin-node-resolve";
import { terser } from "rollup-plugin-terser";
import styles from "rollup-plugin-styles";
import json from "@rollup/plugin-json";
import del from "rollup-plugin-delete";
import commonjs from "@rollup/plugin-commonjs";

// `npm run build` -> `production` is true
// `npm run dev` -> `production` is false
const production = !process.env.ROLLUP_WATCH;

const CHUNK_FILENAME_PREFIX = "chunk-";

export default {
  input: [
    "./src/collectionSurveyorSearchResults/src/collection-surveyor-search-results.ts",
    "./src/collectionSurveyorFacet/src/collection-surveyor-facet.ts",
    "./src/collectionSurveyorPagination/src/collection-surveyor-pagination.ts",
    "./src/collectionSurveyorCart/src/collection-surveyor-cart.ts",
    "./src/collectionSurveyorSearchBar/src/collection-surveyor-search-bar.ts",
    "./src/collectionSurveyorActiveFilters/src/collection-surveyor-active-filters.ts",
  ],
  output: {
    dir: "../keystone/static/js",
    format: "es",
    sourcemap: true,
    chunkFileNames: `${CHUNK_FILENAME_PREFIX}[name].js`,
    entryFileNames: "[name].js",
  },
  plugins: [
    typescript({ tsconfig: "./tsconfig.json" }),
    commonjs(),
    styles({
      mode: "extract",
    }),
    resolve({
      exportConditions: ["browser", production ? "production" : "development"],
    }),
    production && terser(),
    json(),
    /** Clean the output directory prior to each bundle */
    del({
      targets: ["../keystone/static/js/*.js", "../keystone/static/js/*.map"],
      force: true,
    }),
  ],
};
