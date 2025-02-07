import js from "@eslint/js";
import reactQuery from "@tanstack/eslint-plugin-query";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import zod from "eslint-plugin-zod";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  js.configs.recommended,
  tseslint.configs.recommended,
  {
    ignores: [
      "frontend/src/components/ui/*",
      "backend/migrations/*",
      "**/*.cjs",
    ],
  },
  {
    files: ["**/*.ts"],
    languageOptions: {
      globals: globals.node,
    },
    plugins: {
      zod,
    },
  },
  {
    files: ["frontend/**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      "react-query": reactQuery,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
    },
  },
);
