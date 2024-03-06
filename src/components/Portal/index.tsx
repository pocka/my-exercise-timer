import { type ComponentChildren, type FunctionComponent, render } from "preact";
import { useEffect, useRef } from "preact/hooks";

export interface PortalProps {
	children: ComponentChildren;
}

export const Portal: FunctionComponent<PortalProps> = ({ children }) => {
	const container = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		const el = document.createElement("div");

		container.current = el;

		document.body.appendChild(el);

		return () => {
			document.body.removeChild(el);
		};
	}, []);

	useEffect(() => {
		if (!container.current) {
			return;
		}

		render(<>{children}</>, container.current);
	}, [children]);

	return <noscript />;
};
