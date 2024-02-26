import { type SequenceComposerController } from "../components/SequenceComposer";
import { Action, Description, Layout, Title } from "../components/SingleActionScreen";

import { rest } from "./rest";

export function* bicepCurls(sequence: SequenceComposerController, sets: number = 3) {
	for (let i = 0; i < sets; i++) {
		yield (
			<Layout>
				<Title>
					Bicep Curls Alternating ({i + 1}/{sets})
				</Title>
				<Description>
					Perform alternating bicep curls 8-12 reps. Do not forget to add supination.
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
