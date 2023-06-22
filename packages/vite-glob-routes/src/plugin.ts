import type { Plugin } from "vite";

const virtualPageRoutes = "virtual:glob-page-routes/react-router";
const virtualApiRoutes = "virtual:glob-api-routes/hattip";

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
        // NOTE
        // instead of completely relying on vite's glob import, we could also manually probe files and setup watcher etc...
        // cf. https://github.com/rakkasjs/rakkasjs/blob/18ba680d18f776acf2dedd44444873433552f4e3/packages/rakkasjs/src/features/api-routes/vite-plugin.ts#L8

        if (id === virtualPageRoutes) {
          return `
            import { __viteGlobRoutesInternal } from "@hiogawa/vite-glob-routes";

            // TODO: non-eager import to code split?
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

            // TODO: import only "get/post/put/delete" to tree shake other exports?
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
