import { type Meta, type StoryObj } from "@storybook/preact";

import { Duration, type DurationProps } from ".";

export default {
	component: Duration,
	args: {
		seconds: 3,
	},
} satisfies Meta<DurationProps>;

type Story = StoryObj<DurationProps>;

export const Seconds: Story = {};

export const Minutes: Story = {
	args: {
		seconds: 63,
	},
};

export const SecondsOnly: Story = {
	args: {
		seconds: 63,
		showMinutes: false,
	},
};

export const Hours: Story = {
	args: {
		seconds: 1 * 60 * 60 + 2 * 60 + 3,
		showHours: true,
	},
};

export const NoHours: Story = {
	args: {
		seconds: 1 * 60 * 60 + 2 * 60 + 3,
	},
};
