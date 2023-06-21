import { describe, expect, it } from "vitest";
import { createRouteTree, splitPathSegment } from "./page-routes";

describe(createRouteTree, () => {
  it("basic", () => {
    const Page = () => null;
    const Module = { Page };
    const tree = createRouteTree({
      "/": Module,
      "/index": Module,
      "/other": Module,
      "/[dynamic]": Module,
      "/subdir/index": Module,
      "/subdir/other": Module,
      "/abc/[dynsub]": Module,
      "/abc/[dynsub]/new": Module,
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
            {
              "Component": null,
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
              ],
              "path": "subdir/",
            },
            {
              "Component": null,
              "children": [
                {
                  "Component": [Function],
                  "children": [],
                  "path": ":dynsub",
                },
                {
                  "Component": null,
                  "children": [
                    {
                      "Component": [Function],
                      "children": [],
                      "path": "new",
                    },
                  ],
                  "path": "[dynsub]/",
                },
              ],
              "path": "abc/",
            },
          ],
          "path": "/",
        },
      ]
    `);
  });
});

describe(splitPathSegment, () => {
  // prettier-ignore
  it("basic", () => {
    expect(splitPathSegment("/")).toMatchInlineSnapshot(`
      [
        "/",
      ]
    `);
    expect(splitPathSegment("/xyz")).toMatchInlineSnapshot(`
      [
        "/",
        "xyz",
      ]
    `);
    expect(splitPathSegment("/abc/def")).toMatchInlineSnapshot(`
      [
        "/",
        "abc/",
        "def",
      ]
    `);
  })
});
