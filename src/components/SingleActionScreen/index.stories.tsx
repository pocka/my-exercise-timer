import { action } from "@storybook/addon-actions";
import { type Meta, type StoryObj } from "@storybook/preact";

import { Action, Countdown, Description, Layout, Title } from ".";

export default {
	title: "components/SingleActionScreen",
	render() {
		return (
			<Layout>
				<Title>Alternating Bicep Curls (1/3)</Title>
				<Description>Perform alternating bicep curls 8-12 reps. Do not forget to add supination.</Description>
				<Action onClick={action("Action.onClick")}>Complete</Action>
			</Layout>
		);
	},
} satisfies Meta;

type Story = StoryObj;

export const WithAction: Story = {};

export const WithCountdown: Story = {
	render() {
		return (
			<Layout>
				<Title>Alternating Bicep Curls (1/3)</Title>
				<Description>Perform alternating bicep curls 8-12 reps. Do not forget to add supination.</Description>
				<Countdown seconds={60} onCountdownEnd={action("Countdown.onCountdownEnd")} />
			</Layout>
		);
	},
};
