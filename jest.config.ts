import type { JestConfigWithTsJest } from "ts-jest";

import { compilerOptions } from "./tsconfig.json";

const jestConfig: JestConfigWithTsJest = {
  testEnvironment: "jsdom",
  roots: ["<rootDir>"],
  modulePaths: [compilerOptions.baseUrl],
  moduleNameMapper: {
    "^~/(.*)$": "<rootDir>/app/$1",
  },
  watchPathIgnorePatterns: ["/node_modules/", "/\\.git/", "\\.snap$"],
};

export default jestConfig;
