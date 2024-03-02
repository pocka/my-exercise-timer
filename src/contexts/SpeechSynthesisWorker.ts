/// <reference no-default-lib="true"/>
/// <reference lib="ES2022" />
/// <reference lib="WebWorker" />
import { pipeline } from "@xenova/transformers";

pipeline("text-to-speech", "Xenova/speecht5_tts", { quantized: false }).then(synth => {
	const embeddings = "https://huggingface.co/datasets/Xenova/transformers.js-docs/resolve/main/speaker_embeddings.bin";

	self.addEventListener("message", async ev => {
		if (typeof ev.data === "string") {
			const result = await synth(ev.data, { speaker_embeddings: embeddings });

			self.postMessage(result);

			return;
		}

		return;
	});
});
