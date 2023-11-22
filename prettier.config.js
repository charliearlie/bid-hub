module.exports = {
  importOrder: [
    "^~/components/(.*)$",
    "^~/services(.*)$",
    "^~/types(.*)$",
    "^~/util/(.*)$",
    "^[./]",
  ],
  importOrderSeparation: true,
  plugins: [
    require("prettier-plugin-tailwindcss"),
    "@trivago/prettier-plugin-sort-imports",
  ],
};
