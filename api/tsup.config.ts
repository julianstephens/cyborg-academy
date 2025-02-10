import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["./index.ts"],
  splitting: false,
  sourcemap: true,
  clean: true,
  format: ["esm"],
  banner: ({ format }) => {
    if (format === "esm")
      return {
        js: `import { createRequire } from 'module'; const require = createRequire(import.meta.url);`,
      };
  },
  outDir: "dist",
  external: ["express"],
});
