import { describe, expect, it } from "vitest";
import { createRouteTree } from "./page-routes";

describe(createRouteTree, () => {
  it("basic", () => {
    const Page = () => null;
    const tree = createRouteTree({
      "/index": {
        Page,
      },
      "/other": {
        Page,
      },
      "/[dynamic]": {
        Page,
      },
      "/": {
        Page,
      },
    });
    expect(tree).toMatchInlineSnapshot(`
      [
        {
          "Component": [Function],
          "children": [
            {
              "Component": [Function],
              "index": true,
            },
            {
              "Component": [Function],
              "children": [],
              "path": "other",
            },
            {
              "Component": [Function],
              "children": [],
              "path": ":dynamic",
            },
          ],
          "path": "/",
        },
      ]
    `);
  });
});
