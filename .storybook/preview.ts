import type { Preview } from "@storybook/preact";

import "../src/styles.ts";

const preview: Preview = {
	parameters: {
		actions: { argTypesRegex: "^on[A-Z].*" },
	},
};

export default preview;
