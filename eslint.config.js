import js from "@eslint/js";
import tseslint from "typescript-eslint";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import prettier from "eslint-config-prettier";
import globals from "globals";

export default tseslint.config(
  // Ignore build outputs and deps
  {
    ignores: ["**/dist/**", "**/node_modules/**"],
  },

  // Base JS rules for all files
  js.configs.recommended,

  // TypeScript rules for all TS/TSX files
  {
    files: ["**/*.ts", "**/*.tsx"],
    extends: [tseslint.configs.recommended],
  },

  // Client-specific: React rules
  {
    files: ["packages/client/**/*.{ts,tsx}"],
    extends: [
      react.configs.flat.recommended,
      react.configs.flat["jsx-runtime"],
    ],
    plugins: {
      "react-hooks": reactHooks,
    },
    languageOptions: {
      globals: globals.browser,
    },
    settings: {
      react: { version: "detect" },
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react/prop-types": "off", // TypeScript handles this
    },
  },

  // Server-specific: Node globals
  {
    files: ["packages/server/**/*.ts"],
    languageOptions: {
      globals: globals.node,
    },
  },

  // Prettier must be last — disables conflicting formatting rules
  prettier,
);
