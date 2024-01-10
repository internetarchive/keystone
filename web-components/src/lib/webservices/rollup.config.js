import typescript from "@rollup/plugin-typescript";
import resolve from "@rollup/plugin-node-resolve";
import { terser } from "rollup-plugin-terser";
import styles from "rollup-plugin-styles";
import json from "@rollup/plugin-json";

// `npm run build` -> `production` is true
// `npm run dev` -> `production` is false
const production = !process.env.ROLLUP_WATCH;

export default {
  input: ["./src/aitDataTable/src/ait-data-table.ts"],
  output: {
    dir: "dist",
    format: "es",
    sourcemap: true,
    chunkFileNames: "chunk-[name].js",
  },
  plugins: [
    typescript({ tsconfig: "./tsconfig.json" }),
    styles({
      mode: "extract",
    }),
    resolve({
      exportConditions: ["browser", production ? "production" : "development"],
    }),
    production && terser(),
    json(),
  ],
  moduleContext: {
    [require.resolve("focus-visible")]: "window",
  },
};
