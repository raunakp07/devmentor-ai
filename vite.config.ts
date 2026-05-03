// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, cloudflare (build-only),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... } }) if needed.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

const rootDir = path.dirname(fileURLToPath(import.meta.url));

/** Sync load so `process.env` is set before Vite / server-fn workers start (loadEnv in config alone was too late). */
function applyEnvFile(relativePath: string) {
  const full = path.join(rootDir, relativePath);
  let content: string;
  try {
    content = fs.readFileSync(full, "utf8");
  } catch {
    return;
  }
  for (const line of content.split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("=");
    if (eq === -1) continue;
    const key = t.slice(0, eq).trim();
    let val = t.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (key) process.env[key] = val;
  }
}

applyEnvFile(".env.local");
applyEnvFile(".env");
applyEnvFile(".dev.vars");

export default defineConfig(async (viteEnv) => {
  return {
    vite: {
      resolve: {
        alias:
          viteEnv.command === "serve"
            ? {
                "cloudflare:workers": path.join(rootDir, "src/lib/cloudflare-workers-stub.ts"),
              }
            : {},
      },
    },
  };
});
