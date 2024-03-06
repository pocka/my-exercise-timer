import { action } from "@storybook/addon-actions";
import { type Meta, type StoryObj } from "@storybook/preact";

import { ModalDialog, ModalDialogButton, useModalDialog } from ".";

interface Args {
	sentence: number;
}

export default {
	component: ModalDialog,
	render({ sentence }) {
		const { api, trigger, close } = useModalDialog({ defaultOpen: true });

		return (
			<>
				<button {...trigger}>Open</button>
				<ModalDialog
					api={api}
					title="Foo Bar"
					buttons={[
						<ModalDialogButton onClick={action("Button 1")}>Button 1</ModalDialogButton>,
						<ModalDialogButton onClick={action("Button 2")}>Button 2</ModalDialogButton>,
						<ModalDialogButton onClick={() => close()}>Close</ModalDialogButton>,
					]}
				>
					<div class="flex flex-col gap-2">
						{Array.from({ length: sentence }, (_, i) => <p key={i}>Paragraph</p>)}
					</div>
				</ModalDialog>
			</>
		);
	},
	args: {
		sentence: 1,
	},
} satisfies Meta<Args>;

type Story = StoryObj<Args>;

export const Demo: Story = {};
