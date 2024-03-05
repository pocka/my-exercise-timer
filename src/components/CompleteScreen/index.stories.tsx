import { action } from "@storybook/addon-actions";
import { type Meta, type StoryObj } from "@storybook/preact";

import { CompleteScreen, type CompleteScreenProps } from ".";

export default {
	component: CompleteScreen,
	args: {
		startedAt: new Date("2020-01-01T00:00:00Z"),
		completedAt: new Date("2020-01-01T01:00:00Z"),
		onRestart: action("onRestart"),
	},
} satisfies Meta<CompleteScreenProps>;

type Story = StoryObj<CompleteScreenProps>;

export const Demo: Story = {};
