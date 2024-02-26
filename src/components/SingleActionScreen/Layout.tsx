import { clsx } from "clsx";
import { type ComponentChildren, type FunctionComponent } from "preact";

export interface LayoutProps {
	children: ComponentChildren;
}

export const Layout: FunctionComponent<LayoutProps> = ({ children }) => {
	return (
		<div
			class={clsx(
				"absolute inset-0 py-3 px-4 bg-white text-zinc-800 flex flex-col items-center justify-center",
				"dark:bg-black dark:text-zinc-50",
			)}
		>
			<div class="flex flex-col items-stretch justify-center gap-4 w-full max-w-96">
				{children}
			</div>
		</div>
	);
};
