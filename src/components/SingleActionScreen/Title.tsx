import { type ComponentChildren, type FunctionComponent } from "preact";
import { useEffect, useRef } from "preact/hooks";

import { useSpeechSynthesis } from "../../contexts/SpeechSynthesisContext.tsx";

export interface TitleProps {
	children: ComponentChildren;

	speak?: boolean;
}

export const Title: FunctionComponent<TitleProps> = ({ children, speak = false }) => {
	const ref = useRef<HTMLHeadingElement>(null);

	const speech = useSpeechSynthesis();

	useEffect(() => {
		if (!speak || !speech.active) {
			return;
		}

		return speech.speak(ref);
	}, [speak]);

	return <h1 ref={ref} class="font-bold text-xl">{children}</h1>;
};
