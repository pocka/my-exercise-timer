import { clsx } from "clsx";
import { type ComponentChildren, type FunctionComponent } from "preact";

import { type useModalDialog } from "./useModalDialog.ts";

import { Portal } from "../Portal";

export { useModalDialog } from "./useModalDialog.ts";

export interface ModalDialogProps {
	title: ComponentChildren;

	children: ComponentChildren;

	buttons: ComponentChildren;

	api: ReturnType<typeof useModalDialog>["api"];
}

export const ModalDialog: FunctionComponent<ModalDialogProps> = ({ children, api, title, buttons }) => {
	return (
		<Portal>
			<div {...api.backdropProps} class="fixed inset-0 bg-zinc-50/80 dark:bg-zinc-900/80" />
			<div class="fixed inset-0 flex flex-row items-center justify-center p-4 pointer-events-none">
				<div
					{...api.contentProps}
					class={clsx(
						"container rounded max-w-xl max-h-full shadow-sm",
						"pointer-events-auto overflow-y-auto",
						"bg-zinc-50 text-zinc-800 border border-zinc-300/50",
						"dark:bg-zinc-900 dark:text-zinc-50 dark:border-zinc-600/50",
					)}
				>
					<p {...api.labelProps} class="font-bold p-3 pb-0">{title}</p>
					<div class="text-sm mt-4 px-3 text-zinc-600 dark:text-zinc-100">
						{api.isOpened && children}
					</div>
					<div class="flex flex-row mt-4 justify-end gap-2 sticky bottom-0 bg-inherit p-2 border-t border-inherit">
						{buttons}
					</div>
				</div>
			</div>
		</Portal>
	);
};

export interface ModalDialogButtonProps {
	children: ComponentChildren;

	disabled?: boolean;

	onClick(ev: MouseEvent): void;
}

export const ModalDialogButton: FunctionComponent<ModalDialogButtonProps> = (
	{ children, disabled = false, onClick },
) => {
	return (
		<button
			class={clsx(
				"uppercase tracking-tight text-sm py-1 px-2 rounded",
				"hover:bg-zinc-200/40 dark:hover:bg-zinc-600/40",
				"active:bg-zinc-300/60 dark:active:bg-zinc-700/40",
			)}
			disabled={disabled}
			onClick={onClick}
		>
			{children}
		</button>
	);
};
