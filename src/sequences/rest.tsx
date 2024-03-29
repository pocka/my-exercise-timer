import { type SequenceComposerController } from "../components/SequenceComposer";
import { Countdown, Description, Layout, Title } from "../components/SingleActionScreen";

export function* rest(sequence: SequenceComposerController, seconds: number = 60) {
	yield (
		<Layout>
			<Title speak>
				Rest
			</Title>
			<Description>
				Do nothing.
			</Description>
			<Countdown seconds={seconds} onCountdownEnd={sequence.next} />
		</Layout>
	);
}
