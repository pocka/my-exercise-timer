import { useCallback, useEffect, useId, useRef, useState } from "preact/hooks";

function tryFocus(x: unknown): void {
	if (!(x instanceof HTMLElement)) {
		return;
	}

	x.focus();
}

interface UseModalDialogOptions {
	defaultOpen?: boolean;
}

export function useModalDialog({ defaultOpen = false }: UseModalDialogOptions = {}) {
	const id = useId();
	const labelId = useId();

	const [isOpened, setIsOpened] = useState(defaultOpen);
	const lastFocusedElementBeforeOpen = useRef<Element | null>(null);

	const open = useCallback(() => {
		lastFocusedElementBeforeOpen.current = document.activeElement;
		setIsOpened(true);
	}, []);

	const close = useCallback(() => {
		if (lastFocusedElementBeforeOpen.current instanceof HTMLElement) {
			lastFocusedElementBeforeOpen.current.focus();
			lastFocusedElementBeforeOpen.current = null;
		}

		setIsOpened(false);
	}, []);

	// Focus trap
	useEffect(() => {
		if (!isOpened) {
			return;
		}

		const container = document.getElementById(id);
		if (!container) {
			return;
		}

		const focusableTree = document.createTreeWalker(container, NodeFilter.SHOW_ELEMENT, {
			acceptNode(node) {
				return node instanceof HTMLElement && node.tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
			},
		});

		const roundRoundMerryGoRound = (ev: KeyboardEvent) => {
			if (ev.key !== "Tab") {
				return;
			}

			ev.preventDefault();
			ev.stopPropagation();

			if (ev.shiftKey) {
				if (focusableTree.currentNode === container) {
					tryFocus(focusableTree.lastChild());
					return;
				}

				const prev = focusableTree.previousSibling();
				if (prev) {
					tryFocus(prev);
					return;
				}

				focusableTree.currentNode = container;
				tryFocus(focusableTree.currentNode);

				return;
			}

			if (focusableTree.currentNode === container) {
				tryFocus(focusableTree.firstChild());
				return;
			}

			const next = focusableTree.nextNode();
			if (next) {
				tryFocus(next);
				return;
			}

			focusableTree.currentNode = container;
			tryFocus(focusableTree.currentNode);

			return;
		};

		document.addEventListener("keydown", roundRoundMerryGoRound);

		return () => {
			document.removeEventListener("keydown", roundRoundMerryGoRound);
		};
	}, [isOpened, id]);

	// Handle ESC
	useEffect(() => {
		if (!isOpened) {
			return;
		}

		const onKeyDown = (ev: KeyboardEvent) => {
			if (ev.key !== "Escape") {
				return;
			}

			ev.preventDefault();
			ev.stopPropagation();
			close();
		};

		window.addEventListener("keydown", onKeyDown);

		return () => {
			window.removeEventListener("keydown", onKeyDown);
		};
	}, [isOpened, close]);

	// Focus the dialog
	useEffect(() => {
		if (!isOpened) {
			return;
		}

		const container = document.getElementById(id);
		if (!container) {
			return;
		}

		container.scroll({
			top: 0,
		});
		container.focus();
	}, [isOpened]);

	return {
		close,
		open,
		trigger: {
			"aria-controls": id,
			"aria-expanded": isOpened ? "true" : "false",
			onClick(ev: MouseEvent) {
				ev.preventDefault();
				open();
			},
		},
		api: {
			id,
			isOpened,
			backdropProps: {
				onClick(ev: MouseEvent) {
					ev.preventDefault();
					close();
				},
				style: {
					display: isOpened ? undefined : "none",
				},
			},
			contentProps: {
				"aria-modal": "true",
				"aria-labelledby": labelId,
				id,
				tabIndex: -1,
				role: "dialog",
				onClick(ev: MouseEvent) {
					ev.stopPropagation();
				},
				style: {
					display: isOpened ? undefined : "none",
				},
			},
			labelProps: {
				id: labelId,
			},
		},
	} as const;
}
