import { type FunctionComponent } from "preact";

import { Action, Description, Layout, Title } from "../SingleActionScreen";

const timeFormatter = new Intl.DateTimeFormat(undefined, {
	hourCycle: "h23",
	dateStyle: "medium",
	timeStyle: "short",
});

export interface CompleteScreenProps {
	startedAt: Date;

	completedAt: Date;

	onRestart(): void;
}

export const CompleteScreen: FunctionComponent<CompleteScreenProps> = ({ startedAt, completedAt, onRestart }) => {
	return (
		<Layout>
			<Title speak>
				Completed
			</Title>
			<Description speak>
				You have completed the full exercise menu.
			</Description>
			<dl>
				<dt class="text-xs font-bold text-zinc-500 dark:text-zinc-300">Time Record</dt>
				<dd class="text-sm">{timeFormatter.formatRange(startedAt, completedAt)}</dd>
			</dl>
			<Action
				onClick={() => {
					onRestart();
				}}
			>
				Restart
			</Action>
		</Layout>
	);
};
