import { type ComponentChildren, type FunctionComponent } from "preact";

export interface TitleProps {
	children: ComponentChildren;
}

export const Title: FunctionComponent<TitleProps> = ({ children }) => {
	return <h1 class="font-bold text-xl">{children}</h1>;
};
