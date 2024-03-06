import resolveTailwindConfig from "tailwindcss/resolveConfig";

import tailwindConfig from "../tailwind.config.ts";

type TailwindConfig = ReturnType<typeof resolveTailwindConfig<typeof tailwindConfig>>;
type TailwindColors = TailwindConfig["theme"]["colors"];

type TailwindColor = (colors: TailwindColors) => string;

export function getTailwindColors(): TailwindColors {
	return resolveTailwindConfig(tailwindConfig).theme.colors;
}

export interface GenerateColorsOptions {
	seed?: string;
}

export interface Colors {
	primary: string;
	secondary: string;
}

const white: TailwindColor = colors => colors.white;
const black: TailwindColor = colors => colors.black;

const availableColors = [
	[colors => colors.zinc[800], white],
	[colors => colors.pink[400], black],
	[colors => colors.slate[600], black],
	[colors => colors.red[400], white],
	[colors => colors.rose[400], black],
	[colors => colors.green[400], black],
	[colors => colors.yellow[600], black],
	[colors => colors.purple[400], white],
	[colors => colors.orange[400], white],
	[colors => colors.fuchsia[400], white],
	[colors => colors.blue[500], white],
	[colors => colors.lime[500], white],
	[colors => colors.stone[300], white],
	[colors => colors.sky[600], white],
	[colors => colors.amber[400], white],
	[colors => colors.violet[400], white],
	[colors => colors.teal[400], white],
	[colors => colors.emerald[500], white],
	[colors => colors.indigo[500], white],
] satisfies (readonly [TailwindColor, TailwindColor])[];

function bigMod(left: bigint | number, right: number): number {
	if (typeof left === "bigint") {
		return Number(left % BigInt(right));
	}

	return left % right;
}

export function generate({ seed }: GenerateColorsOptions = {}): Readonly<Colors> {
	const colors = getTailwindColors();

	if (!seed) {
		return {
			primary: colors.zinc[800],
			secondary: colors.white,
		};
	}

	const index = bigMod(Bun.hash(seed), availableColors.length);

	return {
		primary: availableColors[index][0](colors),
		secondary: availableColors[index][1](colors),
	};
}

if (import.meta.main) {
	console.log(JSON.stringify(
		generate({
			seed: import.meta.env.APP_NAME,
		}),
		null,
		2,
	));
}
