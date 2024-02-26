import { type ComponentChildren, createContext, type FunctionComponent } from "preact";
import { useCallback, useContext, useEffect, useMemo, useState } from "preact/hooks";

/**
 * UA does not support WakeLock API.
 */
export interface WakeLockUnavailable {
	type: "unavailable";
}

/**
 * UA denied a request to acquire wake lock.
 */
export interface WakeLockNotAllowed {
	type: "not_allowed";

	error: DOMException;
}

export interface WakeLockRequestFailed {
	type: "request_failed";

	error: unknown;
}

export interface RequestingWakeLock {
	type: "requesting";
}

export interface WakeLockIdle {
	type: "idle";
}

export interface WakeLockActive {
	type: "active";

	sentinel: WakeLockSentinel;
}

export interface ReleasingWakeLock {
	type: "releasing";
}

export type WakeLockState =
	| WakeLockUnavailable
	| WakeLockNotAllowed
	| WakeLockRequestFailed
	| RequestingWakeLock
	| WakeLockIdle
	| WakeLockActive
	| ReleasingWakeLock;

interface WakeLockController {
	state: WakeLockState;

	activate(): void;

	deactivate(): void;
}

const Context = createContext<WakeLockController>({
	state: {
		type: "unavailable",
	},
	activate() {},
	deactivate() {},
});

export interface WakeLockProviderProps {
	children: ComponentChildren;
}

export const WakeLockProvider: FunctionComponent<WakeLockProviderProps> = ({ children }) => {
	const [state, setState] = useState<WakeLockState>(() => {
		if (!navigator.wakeLock) {
			return {
				type: "unavailable",
			};
		}

		return {
			type: "idle",
		};
	});

	const sentinel = state.type === "active" && state.sentinel;

	useEffect(() => {
		if (!sentinel) {
			return;
		}

		const onRelease = () => {
			setState({
				type: "idle",
			});
		};

		sentinel.addEventListener("release", onRelease);

		return () => {
			sentinel.removeEventListener("release", onRelease);
		};
	}, [sentinel]);

	const canActivate = state.type === "idle" || state.type === "request_failed" || state.type === "not_allowed";

	const activate = useCallback(async () => {
		if (!canActivate) {
			return;
		}

		try {
			setState({
				type: "requesting",
			});

			const sentinel = await navigator.wakeLock.request("screen");

			setState({
				type: "active",
				sentinel,
			});
		} catch (error) {
			if (error instanceof DOMException && error.name === "NotAllowedError") {
				setState({
					type: "not_allowed",
					error,
				});
				return;
			}

			setState({
				type: "request_failed",
				error,
			});
		}
	}, [canActivate]);

	const deactivate = useCallback(async () => {
		if (!sentinel || sentinel.released) {
			return;
		}

		try {
			setState({
				type: "releasing",
			});

			await sentinel.release();

			setState({ type: "idle" });
		} catch (_error) {
			// I have totally no idea how to handle this case.
			setState({ type: "idle" });
		}
	}, [sentinel]);

	const value = useMemo<WakeLockController>(() => {
		return {
			state,
			activate,
			deactivate,
		};
	}, [state, activate, deactivate]);

	return (
		<Context.Provider value={value}>
			{children}
		</Context.Provider>
	);
};

export function useWakeLock(): WakeLockController {
	return useContext(Context);
}

export interface MockWakeLockProviderProps {
	children: ComponentChildren;

	state: WakeLockState;

	activate?(): void;
	deactivate?(): void;
}

const noop = () => {};

export const MockWakeLockProvider: FunctionComponent<MockWakeLockProviderProps> = (
	{ children, state, activate, deactivate },
) => {
	const value = useMemo<WakeLockController>(() => {
		return { state, activate: activate ?? noop, deactivate: deactivate ?? noop };
	}, [state, activate, deactivate]);

	return (
		<Context.Provider value={value}>
			{children}
		</Context.Provider>
	);
};
