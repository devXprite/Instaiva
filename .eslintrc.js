module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
    node: true,
    jquery: true,
    mocha: true,
  },
  extends: [
    "airbnb-base",
  ],
  parserOptions: {
    ecmaVersion: "latest",
  },
  rules: {
    quotes: ["error", "double"],
  },
  globals: {
    tippy: "writable",
    Waves: "writable",
    AOS: "writable",
    Swal: "writable",
    saveAs: "writable",
    ClipboardJS: "writable",
  },
};
