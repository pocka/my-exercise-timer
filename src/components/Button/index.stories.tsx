import { action } from "@storybook/addon-actions";
import { type Meta, type StoryObj } from "@storybook/preact";

import { Button, type ButtonProps } from ".";

export default {
	component: Button,
	args: {
		children: "Button",
		onClick: action("onClick"),
	},
} satisfies Meta<ButtonProps>;

type Story = StoryObj<ButtonProps>;

export const Demo: Story = {};
