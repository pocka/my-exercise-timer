import { type SequenceComposerController } from "../components/SequenceComposer";
import { Countdown, Description, Layout, Title } from "../components/SingleActionScreen";

import { useCountdown } from "../hooks/useCountdown";

export function* rest(sequence: SequenceComposerController, seconds: number = 60) {
	yield (
		<Layout>
			<Title>
				Rest
			</Title>
			<Description>
				Do nothing.
			</Description>
			<Countdown seconds={seconds} onCountdownEnd={sequence.next} />
		</Layout>
	);
}
