import { clsx } from "clsx";
import { type ComponentChildren, type FunctionComponent } from "preact";

export interface IconButtonProps {
	class?: string;

	children: ComponentChildren;

	disabled?: boolean;

	label: string;

	onClick(ev: Event): void;
}

export const IconButton: FunctionComponent<IconButtonProps> = (
	{ class: className, children, disabled, label, onClick, ...rest },
) => {
	return (
		<button
			{...rest}
			type="button"
			class={clsx(
				className,
				"disabled:text-zinc-400 dark:disabled:text-zinc-600 p-2 pointer-coarse:p-3",
				"rounded",
				"hover:bg-zinc-100 dark:hover:bg-zinc-700",
				"active:bg-zinc-200 dark:active:bg-zinc-800",
			)}
			disabled={disabled}
			title={label}
			onClick={onClick}
		>
			{children}
			<span class="sr-only">{label}</span>
		</button>
	);
};
