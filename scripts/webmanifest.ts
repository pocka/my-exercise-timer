import type { DisplayModeType, WebAppManifest } from "web-app-manifest";

type ExperimentalDisplayModeType = DisplayModeType | "window-controls-overlay";

type ExperimentalWebAppManifest = WebAppManifest & {
	display_override: readonly ExperimentalDisplayModeType[];
};

interface GenerateOptions {
	baseUrl?: string;

	owner?: string;
}

export const sizes = [32, 192, 512] satisfies number[];

export function generate({ baseUrl = "/", owner }: GenerateOptions = {}): ExperimentalWebAppManifest {
	return {
		name: owner ? `Exercise Timer by ${owner}` : "My Exercise Timer",
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
		owner: import.meta.env.OWNER,
	});

	await Bun.write(
		new URL("../dist/exercise-timer.webmanifest", import.meta.url),
		JSON.stringify(manifest),
	);
}
