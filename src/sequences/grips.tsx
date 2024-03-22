import { type SequenceComposerController } from "../components/SequenceComposer";
import { Action, Countdown, Description, Layout, Title } from "../components/SingleActionScreen";

const SPINNER_DURATION_SECONDS = 60;

export function* grips(sequence: SequenceComposerController, sets: number = 3) {
	yield (
		<Layout>
			<Title speak>Warm-up Gripper</Title>
			<Description>
				Close your warm-up gripper,	 10-12 reps each hand.
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

	yield (
		<Layout>
			<Title speak>
				Extensor Bands
			</Title>
			<Description>
				Lightly expand bands using your fingers.
			</Description>
			<Countdown seconds={30} onCountdownEnd={sequence.next} />
		</Layout>
	);

	for (let i = 0; i < sets; i++) {
		yield (
			<Layout>
				<Title speak>
					Working Gripper ({i + 1}/{sets})
				</Title>
				<Description>
					Close your working gripper, 5-7 reps each hand.
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

		yield (
			<Layout>
				<Title speak>
					Extensor Bands
				</Title>
				<Description>
					Lightly expand bands using your fingers.
				</Description>
				<Countdown seconds={30} onCountdownEnd={sequence.next} />
			</Layout>
		);
	}

	yield (
		<Layout>
			<Title speak>NSD Spinner (Right)</Title>
			<Description speak>
				Press the button when it reaches target RPM.
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

	yield (
		<Layout>
			<Title>
				NSD Spinner (Right)
			</Title>
			<Description speak>
				Keep the RPM for {SPINNER_DURATION_SECONDS} seconds.
			</Description>
			<Countdown seconds={SPINNER_DURATION_SECONDS} onCountdownEnd={sequence.next} />
		</Layout>
	);

	yield (
		<Layout>
			<Title speak>NSD Spinner (Left)</Title>
			<Description speak>
				Press the button when it reaches target RPM.
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

	yield (
		<Layout>
			<Title>
				NSD Spinner (Left)
			</Title>
			<Description speak>
				Keep the RPM for {SPINNER_DURATION_SECONDS} seconds.
			</Description>
			<Countdown seconds={SPINNER_DURATION_SECONDS} onCountdownEnd={sequence.next} />
		</Layout>
	);
}
