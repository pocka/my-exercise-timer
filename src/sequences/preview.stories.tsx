import { action } from "@storybook/addon-actions";
import { type Meta, type StoryObj } from "@storybook/preact";

import { SequenceComposer, type SequenceFunction } from "../components/SequenceComposer";

import { TestingProvider } from "../contexts/TestingContext.tsx";

interface Args {
	countdownSpeed: number;

	sequence: SequenceFunction;
}

export default {
	title: "Sequences/Preview",
	render({ countdownSpeed, sequence }) {
		return (
			<TestingProvider enabled countdownSpeed={countdownSpeed}>
				<SequenceComposer sequence={sequence} onComplete={action("onComplete")} />
			</TestingProvider>
		);
	},
	args: {
		countdownSpeed: 1,
		sequence: function*() {},
	},
} satisfies Meta<Args>;

type Story = StoryObj<Args>;

export const AbWheel: Story = {
	args: {
		sequence: (await import("./abWheel.tsx")).abWheel,
	},
};

export const BicepCurls: Story = {
	args: {
		sequence: (await import("./bicepCurls.tsx")).bicepCurls,
	},
};

export const ChestPress: Story = {
	args: {
		sequence: (await import("./chestPress.tsx")).chestPress,
	},
};

export const Grips: Story = {
	args: {
		sequence: (await import("./grips.tsx")).grips,
	},
};

export const Lunges: Story = {
	args: {
		sequence: (await import("./lunges.tsx")).lunges,
	},
};

export const Planks: Story = {
	args: {
		sequence: (await import("./planks.tsx")).planks,
	},
};

export const Rest: Story = {
	args: {
		sequence: (await import("./rest.tsx")).rest,
	},
};

export const Rows: Story = {
	args: {
		sequence: (await import("./rows.tsx")).rows,
	},
};

export const TricepExtensions: Story = {
	args: {
		sequence: (await import("./tricepExtensions.tsx")).tricepExtensions,
	},
};
