import { useEffect } from "preact/hooks";

export function useAppBadge(active: boolean, count?: number) {
	useEffect(() => {
		if (!(("setAppBadge" in navigator) && "clearAppBadge" in navigator)) {
			return;
		}

		navigator.setAppBadge(count);

		return () => {
			navigator.clearAppBadge();
		};
	}, [
		active,
		count,
	]);
}
