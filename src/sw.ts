/// <reference no-default-lib="true"/>
/// <reference lib="ES2022" />
/// <reference lib="WebWorker" />
import { CacheableResponsePlugin } from "workbox-cacheable-response";
import { registerRoute } from "workbox-routing";
import { StaleWhileRevalidate } from "workbox-strategies";

declare var self: ServiceWorkerGlobalScope;

registerRoute(
	({ request }) => request.mode !== "navigate",
	new StaleWhileRevalidate({
		cacheName: "assets",
		plugins: [
			new CacheableResponsePlugin({
				statuses: [200],
			}),
		],
	}),
);
