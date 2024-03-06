import("./styles.ts");
import("./app.tsx");

if ("serviceWorker" in navigator) {
	const scope = new URL("./", location.href);
	const swUrl = new URL("sw.js", location.href);

	navigator.serviceWorker.register(swUrl, {
		scope: scope.href,
	}).catch(error => {
		console.group("Failed to register a ServiceWorker script.");
		console.info("script URL: " + swUrl.href);
		console.info("scope: " + scope.href);
		console.error(error);
		console.groupEnd();
	});
}

document.title = __APP_NAME__;
