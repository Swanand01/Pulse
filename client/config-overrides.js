const { resolve } = require("path");

module.exports = function override(config) {
  config.resolve = {
    ...config.resolve,
    alias: {
      "@/components": resolve(__dirname, "src/components/"),
      "@/lib": resolve(__dirname, "src/lib/"),
      "@/hooks": resolve(__dirname, "src/hooks/"),
    },
  };

  return config;
};
