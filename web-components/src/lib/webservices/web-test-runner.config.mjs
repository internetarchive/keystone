import { esbuildPlugin } from "@web/dev-server-esbuild";
import { fileURLToPath } from "url";
import { playwrightLauncher } from "@web/test-runner-playwright";

const filteredLogs = ["Running in dev mode", "Lit is in dev mode"];

export default /** @type {import("@web/test-runner").TestRunnerConfig} */ ({
  /** Test files to run */
  files: "src/**/*.test.ts",

  nodeResolve: true,
  browsers: [
    playwrightLauncher({
      product: "chromium",
      createBrowserContext({ browser }) {
        return browser.newContext({
          timezoneId: "America/Los_Angeles",
        });
      },
    }),
  ],
  plugins: [
    esbuildPlugin({
      ts: true,
      target: "auto",
      tsconfig: fileURLToPath(new URL("./tsconfig.json", import.meta.url)),
    }),
  ],

  /** Filter out lit dev mode logs */
  filterBrowserLogs(log) {
    for (const arg of log.args) {
      if (
        typeof arg === "string" &&
        filteredLogs.some((l) => arg.includes(l))
      ) {
        return false;
      }
    }
    return true;
  },
});
