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
    indexHtmlMiddlewarePlugin(),
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

// TOOD: package
function indexHtmlMiddlewarePlugin(): Plugin {
  const virtualId = "virtual:index-html-middleware/hattip";
  const globalViteDevServerKey =
    "__indexHtmlMiddlewarePlugin_globalViteDevServerKey";

  return {
    name: indexHtmlMiddlewarePlugin.name,

    // expose dev server to access "transformIndexHtml"
    // https://github.com/cyco130/vavite/blob/913e066fd557a1720923361db77c195ac237ac26/packages/expose-vite-dev-server/src/index.ts
    // https://github.com/brillout/vite-plugin-ssr/blob/906bd4d0cba2c4eff519ef5622f0dc10128b484a/vite-plugin-ssr/node/runtime/html/injectAssets/getViteDevScripts.ts#L16
    configureServer: (server) => {
      globalThis[globalViteDevServerKey] = server;
    },

    async resolveId(source, _importer, _options) {
      if (source === virtualId) {
        return source;
      }
      return;
    },

    load(id, _options) {
      if (id === virtualId) {
        return `
          import { createIndexHtmlMiddleware } from "/src/plugin-experiment-internal";
          export default createIndexHtmlMiddleware({
            server: globalThis[${JSON.stringify(globalViteDevServerKey)}]
          });
        `;
      }
      return;
    },
  };
}
