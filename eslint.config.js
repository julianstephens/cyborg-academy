import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import js from "@eslint/js";

export default tseslint.config(
  js.configs.recommended,
  tseslint.configs.recommended,
  {
    ignores: ["frontend/src/components/ui/*", "**/*.cjs"],
  },
  {
    files: ["**/*.ts"],
    languageOptions: {
      globals: globals.node,
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
