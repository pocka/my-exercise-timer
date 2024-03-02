import { type ComponentChildren, createContext, type FunctionComponent, type RefObject } from "preact";
import { useCallback, useContext, useEffect, useMemo, useState } from "preact/hooks";

import { useSoundPlaybackQueue } from "./SoundPlaybackQueueContext.tsx";

export interface InactiveSpeechSynthesis {
	active: false;

	activate(): void;
}

export interface ActiveSpeechSynthesis {
	active: true;

	deactivate(): void;

	/**
	 * @returns A function that cancels speak queue.
	 */
	speak(text: string | RefObject<HTMLElement>): () => void;
}

export type SpeechSynthesisController = InactiveSpeechSynthesis | ActiveSpeechSynthesis;

const Context = createContext<SpeechSynthesisController>({
	active: false,
	activate() {},
});

function speakPromise(text: string): Promise<void> {
	return new Promise((resolve, reject) => {
		const utterance = new SpeechSynthesisUtterance(text);

		utterance.addEventListener("end", () => {
			resolve();
		}, { once: true });

		utterance.addEventListener("error", (event) => {
			reject(event.error);
		});

		window.speechSynthesis.speak(utterance);
	});
}

export interface SpeechSynthesisProviderProps {
	children: ComponentChildren;

	/**
	 * Initially active?
	 */
	active?: boolean;

	/**
	 * Text to speak when a user activated speech synthesis.
	 */
	activationText?: string;
}

export const SpeechSynthesisProvider: FunctionComponent<SpeechSynthesisProviderProps> = (
	{ active: defaultActive = false, activationText = "Activated speech synthesis", children },
) => {
	const soundPlaybackQueue = useSoundPlaybackQueue();

	const [active, setActive] = useState(defaultActive);

	const activate = useCallback(() => {
		soundPlaybackQueue.enqueue(() => speakPromise(activationText));
		setActive(true);
	}, [activationText, soundPlaybackQueue.enqueue]);

	const deactivate = useCallback(() => {
		setActive(false);
	}, []);

	const speak = useCallback<ActiveSpeechSynthesis["speak"]>((textOrElement) => {
		if (typeof textOrElement === "string") {
			return soundPlaybackQueue.enqueue(() => speakPromise(textOrElement));
		}

		if (!textOrElement.current) {
			return () => {};
		}

		const text = textOrElement.current.textContent;
		if (!text) {
			return () => {};
		}

		return soundPlaybackQueue.enqueue(() => speakPromise(text));
	}, [soundPlaybackQueue.enqueue]);

	const value = useMemo<SpeechSynthesisController>(() => {
		if (!active) {
			return {
				active,
				activate,
			};
		}

		return {
			active,
			deactivate,
			speak,
		};
	}, [active, activate, deactivate, speak]);

	return <Context.Provider value={value}>{children}</Context.Provider>;
};

export interface MLSpeechSynthesisProviderProps {
	children: ComponentChildren;

	/**
	 * Initially active?
	 */
	active?: boolean;
}

export const MLSpeechSynthesisProvider: FunctionComponent<MLSpeechSynthesisProviderProps> = (
	{ children, active: defaultActive = false },
) => {
	const soundPlaybackQueue = useSoundPlaybackQueue();

	const [worker] = useState(() =>
		new Worker(new URL("./SpeechSynthesisWorker.ts", import.meta.url), { type: "module" })
	);
	const [audio, setAudio] = useState<AudioContext | null>(null);

	useEffect(() => {
		const onMessage = async (ev: MessageEvent) => {
			console.log(ev.data);
			if (
				typeof ev.data !== "object" || !ev.data || !("audio" in ev.data) || !(ev.data.audio instanceof Float32Array)
				|| !("sampling_rate" in ev.data) || typeof ev.data.sampling_rate !== "number"
			) {
				return;
			}

			if (!audio) {
				return;
			}

			const data: Float32Array = ev.data.audio;
			const samplingRate: number = ev.data.sampling_rate;

			const buffer = audio.createBuffer(1, data.length, samplingRate);
			buffer.copyToChannel(data, 0);

			const node = new AudioBufferSourceNode(audio, { buffer });

			node.connect(audio.destination);
			node.start();

			node.addEventListener("ended", () => {
				node.disconnect();
			});
		};

		worker.addEventListener("message", onMessage);

		return () => {
			worker.removeEventListener("message", onMessage);
		};
	}, [soundPlaybackQueue.enqueue, audio]);

	const [active, setActive] = useState(defaultActive);

	const activate = useCallback(() => {
		setActive(true);

		const ctx = new AudioContext();

		const silence = ctx.createBuffer(1, 4, 16_000);
		silence.copyToChannel(new Float32Array([0, 0, 0, 0]), 0);
		const node = new AudioBufferSourceNode(ctx, { buffer: silence });

		node.connect(ctx.destination);
		node.start();

		node.addEventListener("ended", () => {
			node.disconnect();
		});

		setAudio(ctx);
	}, []);

	const deactivate = useCallback(() => {
		setActive(false);
	}, []);

	const speak = useCallback<ActiveSpeechSynthesis["speak"]>((textOrElement) => {
		if (typeof textOrElement === "string") {
			worker.postMessage(textOrElement);

			// TODO: Cancel
			return () => {};
		}

		if (!textOrElement.current) {
			return () => {};
		}

		const text = textOrElement.current.textContent;
		if (!text) {
			return () => {};
		}

		worker.postMessage(text);

		// TODO: Cancel
		return () => {};
	}, []);

	const value = useMemo<SpeechSynthesisController>(() => {
		if (!active) {
			return {
				active,
				activate,
			};
		}

		return {
			active,
			deactivate,
			speak,
		};
	}, [active, activate, deactivate, speak]);

	return <Context.Provider value={value}>{children}</Context.Provider>;
};

export function useSpeechSynthesis(): SpeechSynthesisController {
	return useContext(Context);
}
