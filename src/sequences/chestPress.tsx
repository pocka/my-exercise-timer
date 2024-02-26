import { type SequenceComposerController } from "../components/SequenceComposer";
import { Action, Description, Layout, Title } from "../components/SingleActionScreen";

import { rest } from "./rest";

export function* chestPress(sequence: SequenceComposerController, sets: number = 3) {
	for (let i = 0; i < sets; i++) {
		yield (
			<Layout>
				<Title>
					Chest Press ({i + 1}/{sets})
				</Title>
				<Description>
					8-12 reps.
				</Description>
				<Action
					onClick={() => {
						sequence.next();
					}}
				>
					Done
				</Action>
			</Layout>
		);

		yield* rest(sequence);
	}
}
