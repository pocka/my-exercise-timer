import { type Meta, type StoryObj } from "@storybook/preact";
import { useRef, useState } from "preact/hooks";

import { SoundPlaybackQueueProvider } from "./SoundPlaybackQueueContext.tsx";
import { SpeechSynthesisProvider, useSpeechSynthesis } from "./SpeechSynthesisContext.tsx";

export default {
	title: "Contexts/SpeechSynthesisContext",
	decorators: [Story => (
		<SoundPlaybackQueueProvider intervalMs={200}>
			<SpeechSynthesisProvider>
				{/* @ts-expect-error: Storybook ships incorrect type definition */}
				<Story />
			</SpeechSynthesisProvider>
		</SoundPlaybackQueueProvider>
	)],
	render() {
		const speech = useSpeechSynthesis();
		const [input, setInput] = useState("");
		const ref = useRef<HTMLParagraphElement>(null);

		if (!speech.active) {
			return <button onClick={() => speech.activate()}>Activate</button>;
		}

		return (
			<div class="flex flex-col gap-2 items-start">
				<input
					class="border border-zinc-800"
					type="text"
					value={input}
					onInput={ev => setInput(ev.currentTarget.value)}
				/>
				<button onClick={() => speech.speak(input)}>Speak (text)</button>
				<p ref={ref}>{input}</p>
				<button onClick={() => speech.speak(ref)}>Speak (element)</button>
			</div>
		);
	},
} satisfies Meta;

export const Demo: StoryObj = {};
