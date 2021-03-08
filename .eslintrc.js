module.exports = {
  extends: ['@mediamonks/eslint-config-react'],
  parserOptions: {
    project: 'tsconfig.json',
  },
  rules: {
    "babel/no-unused-expressions": "off",
    "no-shadow": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off"
  }
};
