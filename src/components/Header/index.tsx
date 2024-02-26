import { clsx } from "clsx";
import { type FunctionComponent } from "preact";

import { CircleBackslashIcon } from "../../icons/CircleBackslash.tsx";
import { ExclamationTriangleIcon } from "../../icons/ExclamationTriangle.tsx";
import { LockClosedIcon } from "../../icons/LockClosed.tsx";
import { LockOpenIcon } from "../../icons/LockOpen.tsx";

import { useWakeLock, type WakeLockState } from "../../contexts/WakeLockContext.tsx";

function useWakeLockButton(
	state: WakeLockState,
): {
	disabled?: boolean;
	Icon: FunctionComponent<{ class?: string }>;
	AdditionalIcon?: FunctionComponent<{ class?: string }>;
} {
	switch (state.type) {
		case "requesting":
			return { disabled: true, Icon: LockClosedIcon };
		case "active":
			return { Icon: LockClosedIcon };
		case "unavailable":
			return { disabled: true, Icon: LockOpenIcon, AdditionalIcon: CircleBackslashIcon };
		case "request_failed":
			return { Icon: LockOpenIcon, AdditionalIcon: ExclamationTriangleIcon };
		case "not_allowed":
			return { Icon: LockOpenIcon, AdditionalIcon: ExclamationTriangleIcon };
		case "idle":
			return { Icon: LockOpenIcon };
		case "releasing":
			return { disabled: true, Icon: LockOpenIcon };
	}
}

export const Header: FunctionComponent = () => {
	const wakeLock = useWakeLock();

	const wakeLockButton = useWakeLockButton(wakeLock.state);

	return (
		<header
			class={clsx("fixed bottom-0 left-0 right-0", "border-t border-zinc-400/20 bg-zinc-100/5 dark:bg-zinc-900/5")}
		>
			<div class="container mx-auto p-3 flex flex-row justify-between items-center text-zinc-700 dark:text-zinc-300">
				<div />
				<button
					disabled={wakeLockButton.disabled}
					class="relative disabled:text-zinc-400 dark:disabled:text-zinc-600"
					onClick={() => {
						switch (wakeLock.state.type) {
							case "active":
								wakeLock.deactivate();
								return;
							case "idle":
							case "request_failed":
							case "not_allowed":
								wakeLock.activate();
								return;
							default:
								return;
						}
					}}
				>
					<wakeLockButton.Icon class={clsx(wakeLockButton.AdditionalIcon && "text-zinc-900/15 dark:text-zinc-50/15")} />
					{wakeLockButton.AdditionalIcon && <wakeLockButton.AdditionalIcon class="absolute inset-0" />}
				</button>
			</div>
		</header>
	);
};
