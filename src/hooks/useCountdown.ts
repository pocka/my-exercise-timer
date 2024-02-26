import { useEffect, useState } from "preact/hooks";

import { useTesting } from "../contexts/TestingContext.tsx";

export interface UseCountdownParams {
	durationInSeconds: number;

	onCountdownEnd(): void;
}

/**
 * @returns Remaining seconds.
 */
export function useCountdown({ durationInSeconds, onCountdownEnd }: UseCountdownParams): number {
	const testing = useTesting();

	const [remainingInSeconds, setRemainingInSeconds] = useState(durationInSeconds);

	const isActive = remainingInSeconds > 0;

	// Setup timer.
	useEffect(() => {
		const startMs = Date.now();

		const intervalId = setInterval(() => {
			const now = Date.now();

			setRemainingInSeconds(
				Math.max(0, remainingInSeconds - (Math.floor((now - startMs) / 1_000 * (testing?.countdownSpeed ?? 1)))),
			);
		}, 1_000 / (testing?.countdownSpeed ?? 1));

		return () => {
			clearInterval(intervalId);
		};
	}, [isActive, testing?.countdownSpeed]);

	// Invoke `onCountdownEnd` when reamining seconds is zero.
	useEffect(() => {
		if (isActive) {
			return;
		}

		onCountdownEnd();
	}, [isActive, onCountdownEnd]);

	return remainingInSeconds;
}
