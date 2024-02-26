import { action } from "@storybook/addon-actions";
import { type Meta, type StoryObj } from "@storybook/preact";
import { type ComponentChild, type FunctionComponent } from "preact";
import { useEffect } from "preact/hooks";

import { SequenceComposer, type SequenceComposerController, type SequenceComposerProps } from ".";

export default {
	component: SequenceComposer,
	args: {
		onComplete: action("onComplete"),
	},
	argTypes: {
		sequence: { control: false },
	},
} satisfies Meta<SequenceComposerProps>;

type Story = StoryObj<SequenceComposerProps>;

function* demo({ next }: SequenceComposerController): Generator<ComponentChild> {
	// Yielding element
	yield (
		<div>
			<p class="mb-4">Step 1</p>
			<button class="border border-slate-400 py-2 px-3 rounded" onClick={() => next()}>Next</button>
		</div>
	);

	// Side effect
	console.debug("step 1 done");

	// Static control flow
	for (let i = 0; i < 3; i++) {
		yield (
			<div>
				<p class="mb-4">Step 2 ({i})</p>
				<button class="border border-slate-400 py-2 px-3 rounded" onClick={() => next()}>Next</button>
			</div>
		);
	}

	console.debug("step 2 done");

	yield (
		<div>
			<p class="mb-4">Step 3</p>
			<button class="border border-slate-400 py-2 px-3 rounded" onClick={() => next()}>Done</button>
		</div>
	);

	console.debug("step 3 done");
}

export const Demo: Story = {
	args: {
		sequence: demo,
	},
};

const UnmountEffect: FunctionComponent<{ step: string }> = ({ step }) => {
	useEffect(() => {
		console.debug(`${step} is mounted`);

		return () => {
			console.debug(`${step} is about to be unmounted.`);
		};
	}, [step]);

	return null;
};

export const UnmountTest: Story = {
	args: {
		sequence: function*({ next }: SequenceComposerController): Generator<ComponentChild> {
			yield (
				<div>
					<UnmountEffect step="Step 1" />
					<p class="mb-4">Step 1</p>
					<button class="border border-slate-400 py-2 px-3 rounded" onClick={() => next()}>Next</button>
				</div>
			);

			yield () => {
				useEffect(() => {
					console.debug("Step 2 is mounted");

					return () => {
						console.debug("Step 2 is about to be unmounted.");
					};
				}, []);

				return (
					<div>
						<p class="mb-4">Step 2</p>
						<button class="border border-slate-400 py-2 px-3 rounded" onClick={() => next()}>Next</button>
					</div>
				);
			};

			yield (
				<div>
					<UnmountEffect step="Step 3" />
					<p class="mb-4">Step 3</p>
					<button class="border border-slate-400 py-2 px-3 rounded" onClick={() => next()}>Next</button>
				</div>
			);
		},
	},
};
