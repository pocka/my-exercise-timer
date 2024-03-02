import { type SequenceComposerController } from "../components/SequenceComposer";
import { Action, Description, Layout, Title } from "../components/SingleActionScreen";

import { rest } from "./rest";

export function* abWheel(sequence: SequenceComposerController, sets: number = 3) {
	for (let i = 0; i < sets; i++) {
		yield (
			<Layout>
				<Title speak>
					Ab Wheel ({i + 1}/{sets})
				</Title>
				<Description>
					Roll the wheel. 6-8 reps.
				</Description>
				<Action
					onClick={() => {
						sequence.next();
					}}
				>
					Next
				</Action>
			</Layout>
		);

		yield* rest(sequence);
	}
}
