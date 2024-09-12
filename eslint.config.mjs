import antfu from "@antfu/eslint-config";

export default antfu(
  {
    // formatters: true,
    unocss: true,
    vue: true,
  },
  {
    rules: {
      "no-undef": ["off"],
      "no-console": ["off"],
      "vue/singleline-html-element-content-newline": ["off"],
      "style/quotes": ["off"],
      "style/semi": ["off"],
      "style/comma-dangle": ["off"],
      "style/spaced-comment": ["off"],
      "vue/padding-line-between-blocks": ["off"],
      "style/brace-style": ["off"],
      "vue/html-indent": ["off"],
      "style/member-delimiter-style": ["off"],
      "vue/html-comment-content-spacing": ["off"],
      "object-shorthand": ["off"],
      "unused-imports/no-unused-imports": ["off"],
      "import/newline-after-import": ["off"],
      "vue/attribute-hyphenation": ["off"],
      "style/operator-linebreak": ["off"],
      "vue/operator-linebreak": ["off"],
      "ts/ban-ts-comment": ["off"],
      "import/order": ["off"],
      "unused-imports/no-unused-vars": ["off"],
      "style/indent": ["off"],
    },
  }
);
