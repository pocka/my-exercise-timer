import { type SequenceComposerController } from "../components/SequenceComposer";
import { Action, Description, Layout, Title } from "../components/SingleActionScreen";

import { rest } from "./rest";

export function* tricepExtensions(sequence: SequenceComposerController, sets: number = 3) {
	for (let i = 0; i < sets; i++) {
		yield (
			<Layout>
				<Title speak>
					Dumbbell Tricep Extension ({i + 1}/{sets})
				</Title>
				<Description>
					Perform dumbbell tricep extension 8-12 reps.
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
