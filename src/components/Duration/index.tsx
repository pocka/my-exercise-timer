import { type FunctionComponent } from "preact";

function zeroPad(x: number): string {
	return x.toFixed(0).padStart(2, "0");
}

export interface DurationProps {
	seconds: number;

	/**
	 * @default true
	 */
	showMinutes?: boolean;

	/**
	 * @default false
	 */
	showHours?: boolean;
}

export const Duration: FunctionComponent<DurationProps> = (
	{ seconds, showHours = false, showMinutes = true },
) => {
	if (!showMinutes) {
		return <>{zeroPad(seconds)}</>;
	}

	const minutes = Math.floor(seconds / 60);

	if (!showHours) {
		return (
			<>
				{zeroPad(minutes)}:{zeroPad(seconds % 60)}
			</>
		);
	}

	return (
		<>
			{zeroPad(Math.floor(minutes / 60))}:{zeroPad(minutes % 60)}:{zeroPad(seconds % 60)}
		</>
	);
};
