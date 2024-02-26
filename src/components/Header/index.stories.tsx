import { action } from "@storybook/addon-actions";
import { type Meta, type StoryObj } from "@storybook/preact";

import { MockWakeLockProvider, type WakeLockState } from "../../contexts/WakeLockContext";

import { Header } from ".";

interface Args {
	wakeLock: WakeLockState;
}

export default {
	component: Header,
	args: {
		wakeLock: {
			type: "unavailable",
		},
	},
	render({ wakeLock }) {
		return (
			<MockWakeLockProvider
				state={wakeLock}
				activate={action("wakeLock.activate")}
				deactivate={action("wakeLock.deactivate")}
			>
				<Header />
			</MockWakeLockProvider>
		);
	},
} satisfies Meta<Args>;

type Story = StoryObj<Args>;

export const Default: Story = {};

export const WakeLockRequestError: Story = {
	args: {
		wakeLock: {
			type: "request_failed",
			error: new Error("Sample Error"),
		},
	},
};

export const WakeLockIdle: Story = {
	args: {
		wakeLock: {
			type: "idle",
		},
	},
};

export const WakeLockActive: Story = {
	args: {
		wakeLock: {
			type: "active",
			sentinel: {
				type: "screen",
				addEventListener() {},
				removeEventListener() {},
				release: async (...args) => {
					action("WakeLockSentinel.release")(...args);
				},
				released: false,
				onrelease: null,
				dispatchEvent() {
					return false;
				},
			},
		},
	},
};
