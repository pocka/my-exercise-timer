import { type ComponentChildren, createContext, type FunctionComponent } from "preact";
import { useCallback, useContext, useEffect, useMemo, useState } from "preact/hooks";

type Playback = () => Promise<void>;

export interface SoundPlaybackQueue {
	/**
	 * Minimum interval between playback, in milliseconds.
	 */
	readonly intervalMs: number;

	/**
	 * @returns Dequeue from the queue, if the playback is not started yet.
	 */
	enqueue(playback: Playback): () => void;

	clear(): void;
}

const Context = createContext<SoundPlaybackQueue>({
	intervalMs: 0,
	enqueue() {
		return () => {};
	},
	clear() {},
});

export interface SoundPlaybackQueueProviderProps {
	children: ComponentChildren;

	/**
	 * Minimum interval between playback, in milliseconds.
	 */
	intervalMs: number;
}

export const SoundPlaybackQueueProvider: FunctionComponent<SoundPlaybackQueueProviderProps> = (
	{ children, intervalMs },
) => {
	const [queue, setQueue] = useState(() => new Set<Playback>());
	const [activePlayback, setActivePlayback] = useState<Playback | null>(null);

	if (!activePlayback && queue.size) {
		for (const playback of queue) {
			setActivePlayback(() => playback);
			setQueue(prev => {
				const q = new Set(prev);

				q.delete(playback);

				return q;
			});
			break;
		}
	}

	// Run active playback.
	useEffect(() => {
		if (!activePlayback) {
			return;
		}

		activePlayback().then(() => {
			return new Promise<void>(resolve => {
				setTimeout(() => {
					resolve();
				}, intervalMs);
			});
		}).catch(error => {
			console.error("Audio playback error", error);
		}).then(() => {
			setActivePlayback(null);
		});
	}, [activePlayback]);

	const enqueue = useCallback<SoundPlaybackQueue["enqueue"]>((playback) => {
		setQueue(prev => {
			const q = new Set(prev);

			q.add(playback);

			return q;
		});

		return () => {
			setQueue(prev => {
				const q = new Set(prev);

				q.delete(playback);

				return q;
			});
		};
	}, []);

	const clear = useCallback(() => {
		setQueue(new Set());
	}, []);

	const value = useMemo<SoundPlaybackQueue>(() => {
		return {
			intervalMs,
			enqueue,
			clear,
		};
	}, [intervalMs, enqueue, clear]);

	return <Context.Provider value={value}>{children}</Context.Provider>;
};

export function useSoundPlaybackQueue(): SoundPlaybackQueue {
	return useContext(Context);
}
