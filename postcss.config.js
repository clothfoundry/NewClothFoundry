module.exports = {
  plugins: {
    "postcss-custom-properties": {
      preserve: true,
      importFrom: "styles/global.css"
    },
    "postcss-nested": true,
    "postcss-modules-values": true,
    autoprefixer: true
  }
};
