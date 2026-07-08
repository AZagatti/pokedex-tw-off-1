import { writable } from 'svelte/store';

function createFavoritesStore() {
	const { subscribe, set, update } = writable<Set<string>>(new Set());

	return {
		subscribe,
		add: (pokemonName: string) => {
			update((favs) => {
				const newFavs = new Set(favs);
				newFavs.add(pokemonName);
				if (typeof localStorage !== 'undefined') {
					localStorage.setItem('favorites', JSON.stringify([...newFavs]));
				}
				return newFavs;
			});
		},
		remove: (pokemonName: string) => {
			update((favs) => {
				const newFavs = new Set(favs);
				newFavs.delete(pokemonName);
				if (typeof localStorage !== 'undefined') {
					localStorage.setItem('favorites', JSON.stringify([...newFavs]));
				}
				return newFavs;
			});
		},
		toggle: (pokemonName: string) => {
			update((favs) => {
				const newFavs = new Set(favs);
				if (newFavs.has(pokemonName)) {
					newFavs.delete(pokemonName);
				} else {
					newFavs.add(pokemonName);
				}
				if (typeof localStorage !== 'undefined') {
					localStorage.setItem('favorites', JSON.stringify([...newFavs]));
				}
				return newFavs;
			});
		},
		load: () => {
			if (typeof localStorage !== 'undefined') {
				const stored = localStorage.getItem('favorites');
				if (stored) {
					try {
						const parsed = JSON.parse(stored) as string[];
						set(new Set(parsed));
					} catch {
						// Ignore parse errors
					}
				}
			}
		}
	};
}

export const favoritesStore = createFavoritesStore();
