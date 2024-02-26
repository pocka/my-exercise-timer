import { type ComponentChild, type FunctionComponent } from "preact";
import { useCallback, useEffect, useMemo, useRef, useState } from "preact/hooks";

function isComponent(x: unknown): x is FunctionComponent {
	if (typeof x !== "function") {
		return false;
	}

	if (x.length > 1) {
		return false;
	}

	return true;
}

export interface SequenceComposerController {
	next(): void;
}

export type SequenceFunction<T = void> = (
	controller: SequenceComposerController,
) => Generator<ComponentChild | FunctionComponent, T, void>;

export interface SequenceComposerProps<T = void> {
	/**
	 * A generator function to execute.
	 */
	sequence: SequenceFunction<T>;

	/**
	 * Called when the `sequence` function returns.
	 * @param returnedValue - A value returned by the `sequence` function.
	 */
	onComplete(returnedValue: T): void;
}

/**
 * SequenceComposer enables users to write a simple sequence of components using generator function.
 */
export function SequenceComposer<T>(
	{ sequence, onComplete }: SequenceComposerProps<T>,
): ReturnType<FunctionComponent<SequenceComposerProps<T>>> {
	// We need to set a component, instead of element. Otherwise Preact/React
	// treats yielded element as a content of this component and do not run
	// lifecycle things such as mount/unmount.
	const [Component, setComponent] = useState<FunctionComponent | null>(null);

	const iter = useRef<Iterator<ComponentChild | FunctionComponent, T, void> | null>(null);

	const onCompleteRef = useRef(onComplete);

	// Update `onCompleteRef` so the `next` function does not call staled
	// `onComplete` callback.
	onCompleteRef.current = onComplete;

	const next = useCallback(() => {
		if (!iter.current) {
			return;
		}

		const result = iter.current.next();
		if (result.done) {
			onCompleteRef.current(result.value);
			return;
		}

		setComponent(() => {
			const componentOrElement = result.value;
			if (isComponent(componentOrElement)) {
				return componentOrElement;
			}

			return () => <>{componentOrElement}</>;
		});
	}, []);

	const controller = useMemo<SequenceComposerController>(() => {
		return { next };
	}, [next]);

	if (!iter.current) {
		iter.current = sequence(controller);
		next();
	}

	if (!Component) {
		return null;
	}

	return <Component />;
}
