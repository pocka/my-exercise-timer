import { clsx } from "clsx";
import { type FunctionComponent } from "preact";

import { Logo } from "../Logo";
import { ModalDialog, ModalDialogButton, useModalDialog } from "../ModalDialog";

import { CircleBackslashIcon } from "../../icons/CircleBackslash.tsx";
import { CrossCircledIcon } from "../../icons/CrossCircled.tsx";
import { ExclamationTriangleIcon } from "../../icons/ExclamationTriangle.tsx";
import { LockClosedIcon } from "../../icons/LockClosed.tsx";
import { LockOpenIcon } from "../../icons/LockOpen.tsx";
import { SpeakerLoudIcon } from "../../icons/SpeakerLoud.tsx";
import { SpeakerOffIcon } from "../../icons/SpeakerOff.tsx";

import { useSpeechSynthesis } from "../../contexts/SpeechSynthesisContext.tsx";
import { useWakeLock, type WakeLockState } from "../../contexts/WakeLockContext.tsx";

import { IconButton } from "./IconButton.tsx";
import { ThirdPartyLicense } from "./ThirdPartyLicense.tsx";

const anchor = "underline text-zinc-500 dark:text-zinc-300";

function useWakeLockButton(
	state: WakeLockState,
): {
	disabled?: boolean;
	label: string;
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

	onCancel?(): void;
}

export const Header: FunctionComponent<HeaderProps> = ({ class: className, onCancel }) => {
	const wakeLock = useWakeLock();

	const wakeLockButton = useWakeLockButton(wakeLock.state);

	const speech = useSpeechSynthesis();

	const aboutDialog = useModalDialog();

	return (
		<>
			<header
				class={clsx(className, "border-t border-zinc-400/20 bg-zinc-100/5 dark:bg-zinc-900/5")}
			>
				<div class="container mx-auto p-1 flex flex-row justify-between items-center text-zinc-700 dark:text-zinc-300">
					<IconButton
						{...aboutDialog.trigger}
						label="About this app"
						onClick={aboutDialog.trigger.onClick}
					>
						<Logo
							class="h-[1em] w-auto fill-zinc-50 dark:fill-zinc-900"
							primaryColor="inherit"
							secondaryColor="currentColor"
						/>
					</IconButton>
					<div class="inline-flex flex-row gap-1">
						<IconButton
							disabled={!onCancel}
							label="Cancel this session"
							onClick={() => {
								onCancel?.();
							}}
						>
							<CrossCircledIcon />
						</IconButton>
						<IconButton
							label={speech.active ? "Deactivate speech synthesis" : "Activate speech synthesis"}
							onClick={() => {
								if (speech.active) {
									speech.deactivate();
								} else {
									speech.activate();
								}
							}}
						>
							{speech.active ? <SpeakerLoudIcon /> : <SpeakerOffIcon />}
						</IconButton>
						<IconButton
							class="relative"
							disabled={wakeLockButton.disabled}
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
							label={wakeLockButton.label}
						>
							<wakeLockButton.Icon
								class={clsx(wakeLockButton.AdditionalIcon && "text-zinc-900/15 dark:text-zinc-50/15")}
							/>
							{wakeLockButton.AdditionalIcon && (
								<div class="absolute inset-0 flex justify-center items-center">
									<wakeLockButton.AdditionalIcon />
								</div>
							)}
						</IconButton>
					</div>
				</div>
			</header>
			<ModalDialog
				api={aboutDialog.api}
				title="About this app"
				buttons={<ModalDialogButton onClick={() => aboutDialog.close()}>Close</ModalDialogButton>}
			>
				<p>
					"{__APP_NAME__}" is a programmable timer application, primarily designed for exercise menu navigation and
					countdown purpose.
				</p>
				<p class="mt-2">This application is built as a PWA: you can install and run it while offline.</p>
				<p class="font-bold mt-3">Features:</p>
				<ul class="list-disc pl-4">
					<li>Screen Wake Lock (prevent device from going sleep)</li>
					<li>Speech screen text</li>
					<li>App icon badge (only when installed using desktop browser)</li>
				</ul>
				<p class="font-bold mt-3">Source Code:</p>
				<p class="mt-0.5">
					<a class={anchor} href={__REMOTE_URL__} target="_blank">{__REMOTE_URL__}</a>
				</p>
				{__UPSTREAM_URL__ !== __REMOTE_URL__ && (
					<p class="mt-2">
						This is a fork of <a class={anchor} href={__UPSTREAM_URL__} target="_blank">{__UPSTREAM_URL__}</a>
					</p>
				)}
				{__REVISION__ && (
					<>
						<p class="font-bold mt-3">Revision:</p>
						<p class="mt-0.5">
							{__REVISION__}
						</p>
					</>
				)}
				<p class="font-bold mt-3">Third party software:</p>
				<ThirdPartyLicense class="mt-1" />
			</ModalDialog>
		</>
	);
};
