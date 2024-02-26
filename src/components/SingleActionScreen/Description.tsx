import { type ComponentChildren, type FunctionComponent } from "preact";

export interface DescriptionProps {
	children: ComponentChildren;
}

export const Description: FunctionComponent<DescriptionProps> = ({ children }) => {
	return <p class="text-sm text-zinc-600 dark:text-zinc-200">{children}</p>;
};
