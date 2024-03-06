import type { DisplayModeType, WebAppManifest } from "web-app-manifest";

type ExperimentalDisplayModeType = DisplayModeType | "window-controls-overlay";

type ExperimentalWebAppManifest = WebAppManifest & {
	display_override: readonly ExperimentalDisplayModeType[];
};

interface GenerateOptions {
	baseUrl?: string;

	appName?: string;
}

export const sizes = [32, 192, 512] satisfies number[];

export function generate(
	{ baseUrl = "/", appName = "My Exercise Timer" }: GenerateOptions = {},
): ExperimentalWebAppManifest {
	return {
		name: appName,
		short_name: "Exercise Timer",
		start_url: baseUrl,
		display: "standalone",
		display_override: ["window-controls-overlay"],
		icons: sizes.map(size => ({
			src: `logo-${size}x${size}.png`,
			sizes: `${size}x${size}`,
			type: "image/png",
		})),
		launch_handler: {
			client_mode: "focus-existing",
		},
	};
}

if (import.meta.main) {
	const manifest = generate({
		baseUrl: import.meta.env.BASE_URL,
		appName: import.meta.env.APP_NAME,
	});

	await Bun.write(
		new URL("../dist/exercise-timer.webmanifest", import.meta.url),
		JSON.stringify(manifest),
	);
}
