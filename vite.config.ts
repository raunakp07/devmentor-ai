// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, cloudflare (build-only),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... } }) if needed.
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { loadEnv } from "vite";

const rootDir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(async (viteEnv) => {
  const loaded = loadEnv(viteEnv.mode, process.cwd(), "");
  if (loaded.GROQ_API_KEY) process.env.GROQ_API_KEY = loaded.GROQ_API_KEY;
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
