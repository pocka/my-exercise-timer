import { type SequenceComposerController } from "../components/SequenceComposer";
import { Action, Countdown, Description, Layout, Title } from "../components/SingleActionScreen";

import { rest } from "./rest";

export function* planks(sequence: SequenceComposerController, sets: number = 3, duration: number = 60) {
	yield (
		<Layout>
			<Title>
				{duration} Second Planks
			</Title>
			<Description>
				Press the button when you are ready.
			</Description>
			<Action
				onClick={() => {
					sequence.next();
				}}
			>
				Start
			</Action>
		</Layout>
	);

	for (let i = 0; i < sets; i++) {
		yield (
			<Layout>
				<Title>
					Ready for plank posture
				</Title>
				<Description>
					A set will start shotly.
				</Description>
				<Countdown seconds={5} onCountdownEnd={sequence.next} />
			</Layout>
		);

		yield (
			<Layout>
				<Title>
					{duration} Second Plank ({i + 1}/{sets})
				</Title>
				<Description>
					Keep your posture.
				</Description>
				<Countdown seconds={duration} onCountdownEnd={sequence.next} />
			</Layout>
		);

		yield* rest(sequence);
	}
}
