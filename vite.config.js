import { defineConfig } from "vite"
import eslintPlugin from "vite-plugin-eslint"

export default defineConfig( {
	server: {
		host: true,
	},
	optimizeDeps: {
		esbuildOptions: {
			target: "esnext",
		}
	},
	build: {
		target: "esnext",
		chunkSizeWarningLimit: 1024,
	},
	plugins: [
		eslintPlugin(),
	]
} )
