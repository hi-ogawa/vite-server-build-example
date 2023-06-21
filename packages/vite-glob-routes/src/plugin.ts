import type { Plugin } from "vite";

// TODO: prefix "glob-" like "glob-page-routes" and "glob-api-routes"?
const virtualPageRoutes = "virtual:page-routes/react-router";
const virtualApiRoutes = "virtual:api-routes/hattip";

export function viteGlobRoutes(options: { root: string }): Plugin[] {
  // TODO: should escape js string?
  const root = options.root;
  return [
    {
      name: "@hiogawa/vite-glob-routes",
      enforce: "pre",
      async resolveId(source, _importer, _options) {
        if (source === virtualPageRoutes || source === virtualApiRoutes) {
          return source;
        }
        return;
      },
      load(id, _options) {
        if (id === virtualPageRoutes) {
          return `
            import { __viteGlobRoutesInternal } from "@hiogawa/vite-glob-routes";

            let globPage = import.meta.glob("${root}/**/*.page.(js|jsx|ts|tsx)", { eager: true });
            globPage = __viteGlobRoutesInternal.mapKeys(globPage, k => k.slice("${root}".length).match(/^(.*)\.page\./)[1]);

            let globLayout = import.meta.glob("${root}/**/layout.(js|jsx|ts|tsx)", { eager: true });
            globLayout = __viteGlobRoutesInternal.mapKeys(globLayout, k => k.slice("${root}".length).match(/^(.*)layout\./)[1]);

            // TODO: warn invalid usage e.g. having "/hello.page.tsx" and "/hello/layout.tsx"
            export default __viteGlobRoutesInternal.createReactRouterRoutes({ ...globPage, ...globLayout });
          `;
        }

        if (id === virtualApiRoutes) {
          return `
            import { __viteGlobRoutesInternal } from "@hiogawa/vite-glob-routes";

            let globApi = import.meta.glob("${root}/**/*.api.(js|jsx|ts|tsx)", { eager: true });
            globApi = __viteGlobRoutesInternal.mapKeys(globApi, k => k.slice("${root}".length).match(/^(.*)\.api\./)[1]);

            export default __viteGlobRoutesInternal.createHattipHandler(globApi);
          `;
        }
        return;
      },
    },
  ];
}
