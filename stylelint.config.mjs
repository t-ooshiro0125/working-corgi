export default {
  extends: ["stylelint-config-standard-scss", "stylelint-config-recess-order"],

  rules: {
    "selector-class-pattern": null,
    "custom-property-empty-line-before": null,
  },

  overrides: [
    {
      files: ["**/*.astro"],
      customSyntax: "postcss-html",
      rules: {
        "selector-pseudo-class-no-unknown": [
          true,
          {
            ignorePseudoClasses: ["global"],
          },
        ],
      },
    },
  ],
};
