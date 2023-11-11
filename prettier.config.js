module.exports = {
  importOrder: [
    "^~/services(.*)$",
    "^~/components/(.*)$",
    "^~/util/(.*)$",
    "^[./]",
  ],
  importOrderSeparation: true,
  plugins: [
    require("prettier-plugin-tailwindcss"),
    "@trivago/prettier-plugin-sort-imports",
  ],
};
