import { type ComponentChildren, type FunctionComponent } from "preact";
import { useEffect, useRef } from "preact/hooks";

import { useSpeechSynthesis } from "../../contexts/SpeechSynthesisContext.tsx";

export interface DescriptionProps {
	children: ComponentChildren;

	speak?: boolean;
}

export const Description: FunctionComponent<DescriptionProps> = ({ children, speak = false }) => {
	const ref = useRef<HTMLParagraphElement>(null);

	const speech = useSpeechSynthesis();

	useEffect(() => {
		if (!speak || !speech.active) {
			return;
		}

		return speech.speak(ref);
	}, [speak]);

	return <p ref={ref} class="text-sm text-zinc-600 dark:text-zinc-200">{children}</p>;
};
