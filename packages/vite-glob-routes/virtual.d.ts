declare module "virtual:glob-page-routes/react-router" {
  const value: () => import("react-router").RouteObject[];
  export default value;
}

declare module "virtual:glob-api-routes/hattip" {
  const value: () => import("@hattip/compose").RequestHandler;
  export default value;
}

declare module "virtual:index-html-middleware/hattip" {
  const value: import("./dist/index").__internalIndexHtmlMiddleware.IndexHtmlMiddleware;
  export default value;
}
