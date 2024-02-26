import { type FunctionComponent, render } from "preact";
import { useState } from "preact/hooks";

import { Header } from "./components/Header";
import { SequenceComposer } from "./components/SequenceComposer";
import { Action, Description, Layout, Title } from "./components/SingleActionScreen";

import { TestingProvider } from "./contexts/TestingContext.tsx";
import { useWakeLock, WakeLockProvider } from "./contexts/WakeLockContext.tsx";

import { useCountdown } from "./hooks/useCountdown";

import { bicepCurls } from "./sequences/bicepCurls.tsx";
import { chestPress } from "./sequences/chestPress.tsx";
import { lunges } from "./sequences/lunges.tsx";
import { planks } from "./sequences/planks.tsx";
import { rest as restFn } from "./sequences/rest.tsx";
import { rows } from "./sequences/rows.tsx";
import { shoulderPress } from "./sequences/shoulderPress.tsx";
import { tricepExtensions } from "./sequences/tricepExtensions.tsx";

interface MenuProps {
	onEnd(): void;
}

const Menu: FunctionComponent<MenuProps> = ({ onEnd }) => {
	const wakeLock = useWakeLock();

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

				wakeLock.deactivate();
			}}
			onComplete={() => {
				onEnd();
			}}
		/>
	);
};

const App: FunctionComponent = () => {
	const [state, setState] = useState<"before_start" | "in_menu" | "completed">("before_start");

	switch (state) {
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
							setState("in_menu");
						}}
					>
						Start
					</Action>
				</Layout>
			);
		case "in_menu":
			return <Menu onEnd={() => setState("completed")} />;

		case "completed":
			return (
				<Layout>
					<Title>
						Completed
					</Title>
					<Description>
						You have completed the full exercise menu.
					</Description>
					<Action
						onClick={() => {
							setState("before_start");
						}}
					>
						Restart
					</Action>
				</Layout>
			);
	}
};

render(
	import.meta.env.PROD ? <App /> : (
		<TestingProvider enabled>
			<WakeLockProvider>
				<App />
				<Header />
			</WakeLockProvider>
		</TestingProvider>
	),
	document.body,
);
