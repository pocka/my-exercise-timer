import { clsx } from "clsx";
import { type ComponentChildren, type FunctionComponent } from "preact";

export interface ButtonProps {
	class?: string;

	children: ComponentChildren;

	onClick(event: Event): void;
}

export const Button: FunctionComponent<ButtonProps> = ({ class: className, children, onClick }) => {
	return (
		<button
			class={clsx(
				"relative rounded p-3 pb-4",
				"pointer-coarse:p-5 pointer-coarse:p-6",
				"border-solid border border-zinc-400",
				"text-md font-bold",
				"text-zinc-700 dark:text-zinc-100",
				"hover:bg-zinc-50 dark:hover:bg-zinc-800",
				"active:bg-zinc-100 dark:active:bg-zinc-900",
				className,
			)}
			onClick={(ev) => {
				onClick(ev);
			}}
		>
			<span
				aria-hidden="true"
				class={clsx(
					"absolute inset-px pointer-events-none block",
					"border border-solid rounded",
					"border-t-transparent border-l-transparent border-r-zinc-400 border-b-zinc-400",
				)}
			/>
			{children}
		</button>
	);
};
