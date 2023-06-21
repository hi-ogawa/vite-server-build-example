import type { Plugin } from "vite";

// TODO: d.ts with "declar module"? something like this?
/*
declare module 'virtual:api-routes/hattip' {
  const value: import("@hattip/compose").RequestHandler
  export default value
}
*/
const virtualPageRoutes = "virtual:page-routes/react-router";
const virtualApiRoutes = "virtual:api-routes/hattip";

export function viteGlobRoutes(options: { root: string }): Plugin[] {
  // TODO: escape?
  const root = options.root;
  return [
    {
      name: "@hiogawa/vite-glob-routes",
      enforce: "pre",
      async resolveId(source, _importer, _options) {
        if (source === virtualPageRoutes) {
          return source;
        }
        if (source === virtualApiRoutes) {
          return source;
        }
        return;
      },
      load(id, _options) {
        if (id === virtualPageRoutes) {
        }
        if (id === virtualApiRoutes) {
          return `
            import { __viteGlobRoutesInternal } from "@hiogawa/vite-glob-routes";
            let glob = import.meta.glob("${root}/**/*.api.(js|jsx|ts|tsx)", { eager: true });
            glob = __viteGlobRoutesInternal.mapKeys(glob, k => k.slice("${root}".length).match(/^(.*)\.api\./)[1]);
            export default __viteGlobRoutesInternal.createHattipHandler(glob);
          `;
        }
        return;
      },
    },
  ];
}
