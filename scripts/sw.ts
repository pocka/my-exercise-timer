export async function generate() {
	await Bun.build({
		entrypoints: [new URL("../src/sw.ts", import.meta.url).pathname],
		outdir: new URL("../dist", import.meta.url).pathname,
		define: {
			"process.env.NODE_ENV": JSON.stringify("production"),
		},
	});
}

if (import.meta.main) {
	await generate();
}
