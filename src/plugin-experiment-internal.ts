import { RequestHandler } from "@hattip/compose";
import { tinyassert } from "@hiogawa/utils";
import { Manifest } from "vite";

export function createDocumentMiddleware(options: {
  clientEntry: string;
  render: () => Promise<string>;
}): RequestHandler {
  return async () => {
    let html = await options.render();

    // inject hmr script
    if (import.meta.env.DEV) {
      html = injectToHtml(html, DEV_SCRIPT, "head", "pre");
    }

    // inject client entry script
    let clientScriptPath = options.clientEntry;

    if (!import.meta.env.DEV) {
      // resolve bundled client entry
      const manifestRaw = await import("/dist/client/manifest.json?raw");
      const manifest: Manifest = JSON.parse(manifestRaw.default);
      const entry = manifest[clientScriptPath.slice(1)]; // strip leading "/"
      tinyassert(entry);
      tinyassert(entry.isEntry);
      clientScriptPath = "/" + entry.file;

      // inject css
      for (const cssFile of entry.css ?? []) {
        const cssLink = `<link rel="stylesheet" href="/${cssFile}">`;
        html = injectToHtml(html, cssLink, "head", "post");
      }
    }

    const clientScript = `<script type="module" src="${clientScriptPath}"></script>`;
    html = injectToHtml(html, clientScript, "body", "post");

    return new Response(html, {
      headers: [["content-type", "text/html"]],
    });
  };
}

// TODO: ideally we could grab injection from registered "html transform" plugins?
// https://github.com/vitejs/vite/blob/168e1fc7471c202e5012e61562b5058e549df104/packages/vite/src/node/server/middlewares/indexHtml.ts#L51
// https://github.com/vitejs/vite-plugin-react/blob/deb40a45f8c296ca2ae4e27c7709bec5ae5b9a62/packages/plugin-react/src/index.ts#L268
const DEV_SCRIPT = `\
<script type="module">
  import RefreshRuntime from "/@react-refresh"
  RefreshRuntime.injectIntoGlobalHook(window)
  window.$RefreshReg$ = () => {}
  window.$RefreshSig$ = () => (type) => type
  window.__vite_plugin_react_preamble_installed__ = true
</script>
<script type="module" src="/@vite/client"></script>
`;

// https://github.com/vitejs/vite/blob/2c38bae9458794d42eebd7f7351f5633e2fe8247/packages/vite/src/node/plugins/html.ts#L1037-L1044
function injectToHtml(
  html: string,
  content: string,
  tag: "head" | "body",
  type: "pre" | "post"
): string {
  const re = INJECTION_RE[tag][type];
  tinyassert(html.match(re));
  return html.replace(re, (m) =>
    type === "pre" ? `${m}${content}` : `${content}${m}`
  );
}

const INJECTION_RE = {
  head: {
    pre: /([ \t]*)<head[^>]*>/i,
    post: /([ \t]*)<\/head>/i,
  },
  body: {
    pre: /([ \t]*)<body[^>]*>/i,
    post: /([ \t]*)<\/body>/i,
  },
} as const;
