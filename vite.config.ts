import rollupLicensePlugin from "rollup-plugin-license";
import { defineConfig } from "vite";

export default defineConfig({
	build: {
		rollupOptions: {
			plugins: [
				rollupLicensePlugin({
					thirdParty: {
						output: new URL("./dist/ThirdPartyNotice.txt", import.meta.url).pathname,
					},
				}),
			],
		},
	},
});
