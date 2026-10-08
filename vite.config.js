import { defineConfig } from "vite";

export default defineConfig({
  // relative paths so the build works from any folder on a static server
  base: "./",
  test: {
    environment: "jsdom",
    include: ["tests/**/*.test.js"],
  },
});
