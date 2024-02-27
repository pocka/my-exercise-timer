import { action } from "@storybook/addon-actions";
import { type Meta, type StoryObj } from "@storybook/preact";
import { useState } from "preact/hooks";

import { SoundPlaybackQueueProvider, useSoundPlaybackQueue } from "./SoundPlaybackQueueContext.tsx";

function sleep(ms: number) {
	return new Promise<void>(resolve => {
		setTimeout(() => {
			resolve();
		}, ms);
	});
}

export default {
	title: "Contexts/SoundPlaybackQueueContext",
	decorators: [Story => (
		<SoundPlaybackQueueProvider intervalMs={200}>
			{/* @ts-expect-error: Storybook ships incorrect type definition */}
			<Story />
		</SoundPlaybackQueueProvider>
	)],
	render() {
		const [clickCount, setClickCount] = useState(0);
		const queue = useSoundPlaybackQueue();

		return (
			<button
				onClick={() => {
					action(`enqueue#${clickCount}`)();

					queue.enqueue(async () => {
						action(`queue#${clickCount}.start`)();
						await sleep(Math.random() * 1000 + 500);
						action(`queue${clickCount}.end`)();
					});

					setClickCount(x => x + 1);
				}}
			>
				Enqueue
			</button>
		);
	},
} satisfies Meta;

export const Demo: StoryObj = {};
