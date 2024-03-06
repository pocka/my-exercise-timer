import rollupLicensePlugin from "rollup-plugin-license";
import { defineConfig } from "vite";

const upstreamUrl = process.env.UPSTREAM_URL || "https://github.com/pocka/my-exercise-timer";

export default defineConfig({
	base: process.env.BASE_URL,
	define: {
		__APP_NAME__: JSON.stringify(process.env.APP_NAME || "My Exercise Timer"),
		__UPSTREAM_URL__: JSON.stringify(upstreamUrl),
		__REMOTE_URL__: JSON.stringify(process.env.REMOTE_URL || upstreamUrl),
		__REVISION__: JSON.stringify(process.env.REVISION || null),
	},
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
