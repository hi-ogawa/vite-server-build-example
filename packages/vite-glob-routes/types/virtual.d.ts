declare module "virtual:page-routes/react-router" {
  const value: import("react-router").RouteObject[];
  export default value;
}

declare module "virtual:api-routes/hattip" {
  const value: import("@hattip/compose").RequestHandler;
  export default value;
}
