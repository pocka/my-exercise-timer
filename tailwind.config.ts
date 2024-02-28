import type { Config } from "tailwindcss";

export default {
	content: ["./src/**/*.{html,ts,tsx}"],
	theme: {
		extend: {
			screens: {
				"pointer-coarse": { raw: "(pointer: coarse)" },
			},
		},
	},
	plugins: [],
} satisfies Config;
