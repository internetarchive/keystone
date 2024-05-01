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
    "./src/archCollectionDetailsDatasetTable/src/arch-collection-details-dataset-table.ts",
    "./src/archCollectionsCard/src/arch-collections-card.ts",
    "./src/archCollectionsTable/src/arch-collections-table.ts",
    "./src/archDatasetExplorerTable/src/arch-dataset-explorer-table.ts",
    "./src/archDatasetMetadataForm/src/arch-dataset-metadata-form.ts",
    "./src/archDatasetPublishingCard/src/arch-dataset-publishing-card.ts",
    "./src/archDatasetTeamsSelector/src/arch-dataset-teams-selector.ts",
    "./src/archGenerateDatasetForm/src/arch-generate-dataset-form.ts",
    "./src/archGlobalModal/src/arch-global-modal.ts",
    "./src/archHoverTooltip/src/arch-hover-tooltip.ts",
    "./src/archRecentDatasetsCard/src/arch-recent-datasets-card.ts",
    "./src/archSubCollectionBuilder/src/arch-sub-collection-builder.ts",
    "./src/archUserTable/src/arch-user-table.ts",
    "./src/archEditUserModal/src/arch-edit-user-modal.ts",
    "./src/collectionSurveyorCart/src/collection-surveyor-cart.ts",
    "./src/collectionSurveyorFacet/src/collection-surveyor-facet.ts",
    "./src/collectionSurveyorPagination/src/collection-surveyor-pagination.ts",
    "./src/collectionSurveyorSearchResults/src/collection-surveyor-search-results.ts",
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
