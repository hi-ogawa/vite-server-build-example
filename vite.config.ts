import { viteGlobRoutes } from "@hiogawa/vite-glob-routes";
import vaviteConnect from "@vavite/connect";
import react from "@vitejs/plugin-react";
import unocss from "unocss/vite";
import { Plugin, defineConfig } from "vite";

// TODO: how to support preview?

export default defineConfig((ctx) => ({
  plugins: [
    unocss(),
    react(),
    viteGlobRoutes({ root: "/src/routes" }),
    documentMiddlewarePlugin({
      clientEntry: "/src/client/index.tsx",
      documentEntry: "/src/server/document.tsx",
    }),
    vaviteConnect({
      standalone: false,
      serveClientAssetsInDev: true,
      handlerEntry:
        ctx.command === "build"
          ? "./src/server/entry-vercel-edge.ts"
          : "./src/server/entry-connect.ts",
    }),
  ],
  build: {
    outDir: ctx.ssrBuild ? "dist/server" : "dist/client",
    sourcemap: true,
  },
  clearScreen: false,
}));

function documentMiddlewarePlugin(options: {
  clientEntry: string;
  documentEntry: string;
}): Plugin {
  const virtualDocumentHattip = "virtual:document-middleware/hattip";

  return {
    name: documentMiddlewarePlugin.name,

    config(config, _env) {
      if (!config.build?.ssr) {
        return {
          build: {
            manifest: true,
            rollupOptions: {
              input: [options.clientEntry],
            },
          },
        };
      }
    },

    async resolveId(source, _importer, _options) {
      if (source === virtualDocumentHattip) {
        return source;
      }
      return;
    },

    load(id, _options) {
      if (id === virtualDocumentHattip) {
        return `
          import { createDocumentHandler } from "/src/plugin-experiment-internal";
          import { render } from "${options.documentEntry}";
          export default () => createDocumentHandler({
            clientEntry: ${JSON.stringify(options.clientEntry)},
            render,
          });
        `;
      }
      return;
    },
  };
}
