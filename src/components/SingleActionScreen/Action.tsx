import { clsx } from "clsx";
import { type ComponentChildren, type FunctionComponent } from "preact";

import { Button, type ButtonProps } from "../Button";

export type ActionProps = ButtonProps;

export const Action: FunctionComponent<ActionProps> = ({ class: className, ...rest }) => {
	return <Button {...rest} class={clsx("mt-4", className)} />;
};
