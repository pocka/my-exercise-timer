import { type FunctionComponent, render } from "preact";
import { useState } from "preact/hooks";

import { CompleteScreen } from "./components/CompleteScreen";
import { Header } from "./components/Header";
import { SequenceComposer } from "./components/SequenceComposer";
import { Action, Description, Layout, Title } from "./components/SingleActionScreen";

import { SoundPlaybackQueueProvider } from "./contexts/SoundPlaybackQueueContext.tsx";
import { SpeechSynthesisProvider } from "./contexts/SpeechSynthesisContext.tsx";
import { TestingProvider } from "./contexts/TestingContext.tsx";
import { useWakeLock, WakeLockProvider } from "./contexts/WakeLockContext.tsx";

import { useAppBadge } from "./hooks/useAppBadge.ts";

import { abWheel } from "./sequences/abWheel.tsx";
import { bicepCurls } from "./sequences/bicepCurls.tsx";
import { chestPress } from "./sequences/chestPress.tsx";
import { grips } from "./sequences/grips.tsx";
import { lunges } from "./sequences/lunges.tsx";
import { planks } from "./sequences/planks.tsx";
import { rows } from "./sequences/rows.tsx";
import { shoulderPress } from "./sequences/shoulderPress.tsx";
import { tricepExtensions } from "./sequences/tricepExtensions.tsx";

interface TimeRecord {
	startedAt: Date;

	endedAt: Date;
}

interface MenuProps {
	onEnd(timeRecord: TimeRecord): void;
}

const Menu: FunctionComponent<MenuProps> = ({ onEnd }) => {
	const wakeLock = useWakeLock();

	useAppBadge(true);

	const [startedAt] = useState(() => new Date());

	return (
		<SequenceComposer
			sequence={function*(sequence) {
				wakeLock.activate();

				yield* lunges(sequence);

				yield* rows(sequence);

				yield* chestPress(sequence);

				yield* shoulderPress(sequence);

				yield* bicepCurls(sequence);

				yield* tricepExtensions(sequence);

				yield* planks(sequence);

				yield* abWheel(sequence);

				yield* grips(sequence);

				wakeLock.deactivate();
			}}
			onComplete={() => {
				onEnd({ startedAt, endedAt: new Date() });
			}}
		/>
	);
};

type Scene = { type: "before_start" } | { type: "in_menu" } | { type: "completed"; timeRecord: TimeRecord };

interface BodyProps {
	scene: Scene;

	onChangeScene(scene: Scene): void;
}

const Body: FunctionComponent<BodyProps> = ({ scene, onChangeScene }) => {
	switch (scene.type) {
		case "before_start":
			return (
				<Layout>
					<Title>
						My exercise
					</Title>
					<Description>
						Estimated duration: 60 mins.
					</Description>
					<Action
						onClick={() => {
							onChangeScene({ type: "in_menu" });
						}}
					>
						Start
					</Action>
				</Layout>
			);
		case "in_menu":
			return <Menu onEnd={(timeRecord) => onChangeScene({ type: "completed", timeRecord })} />;

		case "completed":
			return (
				<CompleteScreen
					startedAt={scene.timeRecord.startedAt}
					completedAt={scene.timeRecord.endedAt}
					onRestart={() => onChangeScene({ type: "before_start" })}
				/>
			);
	}
};

const App: FunctionComponent = () => {
	const [scene, setScene] = useState<Scene>({ type: "before_start" });

	return (
		<div class="absolute inset-0 flex flex-col">
			<main class="relative grow shrink">
				<Body scene={scene} onChangeScene={setScene} />
			</main>
			<Header
				class="grow-0 shrink-0"
				onCancel={scene.type === "before_start" ? undefined : () => {
					setScene({ type: "before_start" });
				}}
			/>
		</div>
	);
};

render(
	import.meta.env.PROD ? <App /> : (
		<TestingProvider enabled>
			<WakeLockProvider>
				<SoundPlaybackQueueProvider intervalMs={100}>
					<SpeechSynthesisProvider>
						<App />
					</SpeechSynthesisProvider>
				</SoundPlaybackQueueProvider>
			</WakeLockProvider>
		</TestingProvider>
	),
	document.body,
);
