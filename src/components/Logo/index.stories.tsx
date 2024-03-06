import { type Meta, type StoryObj } from "@storybook/preact";

import { Logo, type LogoProps } from ".";

export default {
	component: Logo,
	args: {
		primaryColor: "currentColor",
		secondaryColor: "inherit",
		class: "block h-10 w-auto fill-zinc-900 text-zinc-50",
	},
} satisfies Meta<LogoProps>;

type Story = StoryObj<LogoProps>;

export const Demo: Story = {};
