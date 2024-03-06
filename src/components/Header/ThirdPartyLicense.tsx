import { clsx } from "clsx";
import { type FunctionComponent } from "preact";
import { useEffect, useMemo, useState } from "preact/hooks";

interface Fetching {
	isFetching: true;
}

interface Fetched<T> {
	isFetching: false;
	isError: false;

	data: T;
}

interface FailedToFetch<E> {
	isFetching: false;
	isError: true;

	error: E;
}

type FetchState<T, E = unknown> = Fetching | Fetched<T> | FailedToFetch<E>;

export interface ThirdPartyLicenseProps {
	class?: string;
}

export const ThirdPartyLicense: FunctionComponent<ThirdPartyLicenseProps> = ({ class: className }) => {
	const [state, setState] = useState<FetchState<string>>(() => {
		return { isFetching: true };
	});

	useEffect(() => {
		fetch("./ThirdPartyNotice.txt").then(resp => {
			if (resp.status !== 200) {
				return Promise.reject(new Error(`Unexpected status code: ${resp.status}`));
			}

			return resp.text();
		}).then(text => {
			setState({
				isFetching: false,
				isError: false,
				data: text,
			});
		}).catch(error => {
			setState({
				isFetching: false,
				isError: true,
				error,
			});
		});
	}, []);

	const value = useMemo<string>(() => {
		if (state.isFetching) {
			return "Loading license file...";
		}

		if (state.isError) {
			return "Failed to load license file: "
				+ (state.error instanceof Error
					? state.error.message + (state.error.stack ? "\n" + state.error.stack : "")
					: String(state.error));
		}

		return state.data;
	}, [state]);

	return (
		<textarea
			autocapitalize="off"
			autocomplete="off"
			spellcheck={false}
			class={clsx(
				className,
				"text-nowrap whitespace-pre overflow-auto w-full rounded p-2",
				"bg-zinc-100 dark:bg-zinc-800",
			)}
			readonly
			rows={10}
			value={value}
		/>
	);
};
