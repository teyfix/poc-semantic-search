module.exports = {
  jsonRecursiveSort: true,
  jsonSortOrder: JSON.stringify({
    id: null,
    "/.*/": "lexical",
  }),
  overrides: [
    {
      files: "*.{md,mdx}",
      options: {
        printWidth: 80000,
      },
    },
  ],
  plugins: ["prettier-plugin-sort-json", "prettier-plugin-packagejson"],
  printWidth: 80,
  proseWrap: "always",
};
