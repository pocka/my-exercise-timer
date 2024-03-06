import { renderAsync } from "@resvg/resvg-js";
import { render } from "preact-render-to-string";

import { Logo, type LogoProps } from "../src/components/Logo";

import { generate as generateColors } from "./colors.ts";
import * as webmanifest from "./webmanifest.ts";

export function generateSVG(props: LogoProps): string {
	return render(<Logo {...props} />);
}

const sizes: readonly number[] = [16, 32, 96, ...webmanifest.sizes].filter((x, i, arr) => arr.indexOf(x) === i);

if (import.meta.main) {
	const colors = generateColors({
		seed: import.meta.env.APP_NAME,
	});

	const svg = generateSVG({
		size: 32,
		primaryColor: colors.primary,
		secondaryColor: colors.secondary,
	});

	await Bun.write(
		new URL("../dist/logo.svg", import.meta.url),
		svg,
	);

	for (const size of sizes) {
		const png = await renderAsync(svg, {
			fitTo: {
				mode: "width",
				value: size,
			},
		});

		await Bun.write(
			new URL(`../dist/logo-${size}x${size}.png`, import.meta.url),
			png.asPng(),
		);
	}
}
