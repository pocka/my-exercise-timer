import { type ComponentChildren, createContext, type FunctionComponent } from "preact";
import { useContext, useMemo } from "preact/hooks";

interface Testing {
	countdownSpeed?: number;
}

const Context = createContext<Testing | null>(null);

function parseIntParameter(url: URL, paramName: string): number | undefined {
	const value = url.searchParams.get(paramName);
	if (!value) {
		return undefined;
	}

	const x = parseInt(value, 10);
	if (!Number.isFinite(x)) {
		return undefined;
	}

	return x;
}

export interface TestingProviderProps {
	children: ComponentChildren;

	enabled: boolean;

	countdownSpeed?: number;
}

export const TestingProvider: FunctionComponent<TestingProviderProps> = ({ children, enabled, countdownSpeed }) => {
	const value = useMemo<Testing | null>(() => {
		if (!enabled) {
			return null;
		}

		const url = new URL(location.href);

		return {
			countdownSpeed: countdownSpeed ?? parseIntParameter(url, "cspeed"),
		};
	}, [enabled, countdownSpeed]);

	return <Context.Provider value={value}>{children}</Context.Provider>;
};

export function useTesting(): Testing | null {
	return useContext(Context);
}
