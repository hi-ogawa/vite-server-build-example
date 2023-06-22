// can use e.g. preact-render-to-string
export function render(): string {
  return `\
<html>
  <head>
    <meta charset="UTF-8" />
    <title>vite-server-build-example</title>
    <meta
      name="viewport"
      content="width=device-width, height=device-height, initial-scale=1.0"
    />
    <!-- https://remixicon.com/icon/tools-line -->
    <link
      rel="icon"
      type="image/svg+xml"
      href="data:image/svg+xml;base64,CiAgICAgICAgPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+CiAgICAgICAgICA8c3R5bGU+CiAgICAgICAgICAgIDpyb290IHsgY29sb3I6IGJsYWNrIH0KICAgICAgICAgICAgQG1lZGlhIChwcmVmZXJzLWNvbG9yLXNjaGVtZTogZGFyaykgewogICAgICAgICAgICAgIDpyb290IHsgY29sb3I6IHdoaXRlIH0KICAgICAgICAgICAgfQogICAgICAgICAgPC9zdHlsZT4KICAgICAgICAgIDxwYXRoIGZpbGw9ImN1cnJlbnRDb2xvciIgZD0iTTUuMzI4OTQgMy4yNzE1OEM2LjU2MjAzIDIuODMzMiA3Ljk5MTgxIDMuMTA3NDkgOC45Nzg3OCA0LjA5NDQ2QzEwLjA5OTcgNS4yMTUzNyAxMC4zMDE0IDYuOTA3NDEgOS41ODM4MiA4LjIzMzg1TDIwLjI5MjUgMTguOTQzN0wxOC44NzgzIDIwLjM1NzlMOC4xNjkzMyA5LjY0ODc1QzYuODQyNzcgMTAuMzY2OSA1LjE1MDIgMTAuMTY1NCA0LjAyOTAzIDkuMDQ0MjFDMy4wNDE3OCA4LjA1Njk2IDIuNzY3NjEgNi42MjY2NSAzLjIwNjUyIDUuMzkzMzJMNS40NDMyNSA3LjYzQzYuMDI5MDMgOC4yMTU3OCA2Ljk3ODc4IDguMjE1NzggNy41NjQ1NyA3LjYzQzguMTUwMzUgNy4wNDQyMSA4LjE1MDM1IDYuMDk0NDYgNy41NjQ1NyA1LjUwODY4TDUuMzI4OTQgMy4yNzE1OFpNMTUuNjk2MyA1LjE1NTEyTDE4Ljg3ODMgMy4zODczNkwyMC4yOTI1IDQuODAxNTdMMTguNTI0NyA3Ljk4MzU1TDE2Ljc1NyA4LjMzNzFMMTQuNjM1NiAxMC40NTg0TDEzLjIyMTQgOS4wNDQyMUwxNS4zNDI3IDYuOTIyODlMMTUuNjk2MyA1LjE1NTEyWk04Ljk3ODc4IDEzLjI4NjhMMTAuMzkzIDE0LjcwMTFMNS4wODk2OSAyMC4wMDQ0QzQuNjk5MTcgMjAuMzk0OSA0LjA2NiAyMC4zOTQ5IDMuNjc1NDggMjAuMDA0NEMzLjMxMjg1IDE5LjY0MTcgMy4yODY5NSAxOS4wNjk5IDMuNTk3NzcgMTguNjc3NEwzLjY3NTQ4IDE4LjU5MDJMOC45Nzg3OCAxMy4yODY4WiI+PC9wYXRoPgogICAgICAgIDwvc3ZnPgogICAgICA="
    />
    <style>
      html, body, #root {
        height: 100%;
      }
    </style>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
`;
}
