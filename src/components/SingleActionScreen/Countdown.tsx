import { clsx } from "clsx";
import { type FunctionComponent } from "preact";

import { Duration } from "../Duration";

import { useTesting } from "../../contexts/TestingContext.tsx";

import { useCountdown } from "../../hooks/useCountdown.ts";

import css from "./Countdown.module.css";

const anHour = 60 * 60;

export interface CountdownProps {
	class?: string;

	seconds: number;

	onCountdownEnd(): void;
}

export const Countdown: FunctionComponent<CountdownProps> = ({ class: className, seconds, onCountdownEnd }) => {
	const testing = useTesting();

	const remainings = useCountdown({
		durationInSeconds: seconds,
		onCountdownEnd,
	});

	return (
		<div class="relative overflow-hidden mt-4 p-0">
			<div
				class={clsx(
					className,
					"text-3xl font-bold tabular-nums slashed-zero",
					"text-zinc-800 dark:text-zinc-50",
				)}
			>
				<Duration
					seconds={remainings}
					showHours={seconds >= anHour}
				/>
			</div>
			<div
				class={clsx(
					"relative w-full h-3 mt-1.5 overflow-hidden",
					"border border-zinc-600 dark:border-zinc-400 rounded-lg",
				)}
			>
				<div
					class={clsx(
						"absolute top-0 w-full h-full",
						"bg-origin-content bg-repeat dark:invert",
						"opacity-50 dark:opacity-80",
					)}
					style={{
						backgroundImage:
							`url('data:image/svg+xml;utf8,<svg viewBox="0 0 100 100" width="20" height="20" xmlns="http://www.w3.org/2000/svg" stroke="%23000" stroke-width="10"><line x1="90" x2="110" y1="-10" y2="10" /><line x1="-10" x2="10" y1="90" y2="110" /><line x1="0" x2="100" y1="0" y2="100" /></svg>')`,
						backgroundSize: "8px 8px",
						left: -1,
						width: "calc(100% + 2px)",
					}}
				/>
				<div
					class={clsx(
						"absolute top-0 h-full",
						"border-l border-inherit bg-zinc-50 dark:bg-black",
						css.progress,
					)}
					style={{
						left: -1,
						width: "calc(100% + 2px)",
						animationDuration: `${(seconds / (testing?.countdownSpeed ?? 1))}s`,
					}}
				/>
			</div>
		</div>
	);
};
