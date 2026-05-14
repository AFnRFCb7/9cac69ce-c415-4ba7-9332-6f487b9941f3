import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import vue from "eslint-plugin-vue";
import vueA11y from "eslint-plugin-vuejs-accessibility";
import custom from "./eslint/custom-rules.js";
import vueParser from "vue-eslint-parser";

export default [
  js.configs.recommended,

  ...tseslint.configs.recommended,

  ...vue.configs["flat/recommended"],

  {
    files: ["**/*.{js,ts,vue}"],
    plugins: {
        "vuejs-accessibility": vueA11y,
        "vue-local": custom.plugins["vue-local"],

    },
    rules: {
        "vue-local/require-label-or-aria": "error",
        "vue/no-bare-strings-in-template": "warn" ,
        "vuejs-accessibility/alt-text": "warn"
    } ,
    languageOptions: {
      globals: globals.browser,
      parser: vueParser,
      parserOptions: {
        parser: tseslint.parser,
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
  },
];