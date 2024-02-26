import { type Meta, type StoryObj } from "@storybook/preact";

import { Button, type ButtonProps } from ".";

export default {
	component: Button,
	args: {
		children: "Button",
	},
} satisfies Meta<ButtonProps>;

type Story = StoryObj<ButtonProps>;

export const Demo: Story = {};
