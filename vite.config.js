import {defineConfig} from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
	build: {
		lib: {
			entry: "src/index.ts",
			formats: ["es", "cjs"],
			fileName: (format) => {
				return format === "cjs" ? "odata-filer-to-ast.cjs" : `odata-filer-to-ast.${format}.js`;
			}
		}
	},
	test: {
		dir: "src/",
	},
	plugins: [dts()],
})
