import rollupLicensePlugin from "rollup-plugin-license";
import { defineConfig } from "vite";

export default defineConfig({
	base: process.env.BASE_URL,
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
