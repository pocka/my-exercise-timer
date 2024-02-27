import { type ComponentChildren, createContext, type FunctionComponent, type RefObject } from "preact";
import { useCallback, useContext, useMemo, useState } from "preact/hooks";

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

export function useSpeechSynthesis(): SpeechSynthesisController {
	return useContext(Context);
}
