import { type SequenceComposerController } from "../components/SequenceComposer";
import { Action, Description, Layout, Title } from "../components/SingleActionScreen";

import { rest } from "./rest";

export function* lunges(sequence: SequenceComposerController, sets: number = 3) {
	for (let i = 0; i < sets; i++) {
		yield (
			<Layout>
				<Title>
					Walking Lunges ({i + 1}/{sets})
				</Title>
				<Description>
					8-12 reps, each legs.
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
