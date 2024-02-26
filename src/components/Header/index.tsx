import { clsx } from "clsx";
import { type ComponentChild, type FunctionComponent } from "preact";

import { CircleBackslashIcon } from "../../icons/CircleBackslash.tsx";
import { ExclamationTriangleIcon } from "../../icons/ExclamationTriangle.tsx";
import { LockClosedIcon } from "../../icons/LockClosed.tsx";
import { LockOpenIcon } from "../../icons/LockOpen.tsx";

import { useWakeLock, type WakeLockState } from "../../contexts/WakeLockContext.tsx";

function useWakeLockButton(
	state: WakeLockState,
): {
	disabled?: boolean;
	label: ComponentChild;
	Icon: FunctionComponent<{ class?: string }>;
	AdditionalIcon?: FunctionComponent<{ class?: string }>;
} {
	switch (state.type) {
		case "requesting":
			return { disabled: true, Icon: LockClosedIcon, label: "Activating wake lock..." };
		case "active":
			return { Icon: LockClosedIcon, label: "Press to deactivate wake lock" };
		case "unavailable":
			return {
				disabled: true,
				Icon: LockOpenIcon,
				AdditionalIcon: CircleBackslashIcon,
				label: "Wake lock is not available on this platform",
			};
		case "request_failed":
			return { Icon: LockOpenIcon, AdditionalIcon: ExclamationTriangleIcon, label: "Failed to activate wake lock" };
		case "not_allowed":
			return {
				Icon: LockOpenIcon,
				AdditionalIcon: ExclamationTriangleIcon,
				label: "Wake lock request was rejected due to platform restriction",
			};
		case "idle":
			return { Icon: LockOpenIcon, label: "Press to activate wake lock" };
		case "releasing":
			return { disabled: true, Icon: LockOpenIcon, label: "Deactivating wake lock..." };
	}
}

export interface HeaderProps {
	class?: string;
}

export const Header: FunctionComponent<HeaderProps> = ({ class: className }) => {
	const wakeLock = useWakeLock();

	const wakeLockButton = useWakeLockButton(wakeLock.state);

	return (
		<header
			class={clsx(className, "border-t border-zinc-400/20 bg-zinc-100/5 dark:bg-zinc-900/5")}
		>
			<div class="container mx-auto p-1 flex flex-row justify-between items-center text-zinc-700 dark:text-zinc-300">
				<div />
				<button
					disabled={wakeLockButton.disabled}
					class="relative disabled:text-zinc-400 dark:disabled:text-zinc-600 p-2 pointer-coarse:p-3"
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
					{wakeLockButton.AdditionalIcon && (
						<div class="absolute inset-0 flex justify-center items-center">
							<wakeLockButton.AdditionalIcon />
						</div>
					)}
					<span class="sr-only">{wakeLockButton.label}</span>
				</button>
			</div>
		</header>
	);
};
