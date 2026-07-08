import { fetchPokemon, fetchPokemonList } from '$lib/api/client';
import type { Pokemon } from '$lib/api/schemas';

export const prerender = true;

export async function load() {
	const pokemonList = await fetchPokemonList(30, 0);

	const pokemonDetails = await Promise.all(
		pokemonList.results.map(async (p) => {
			try {
				return await fetchPokemon(p.name);
			} catch {
				return null;
			}
		})
	);

	const validPokemon = pokemonDetails.filter((p): p is Pokemon => p !== null);

	return {
		initialPokemon: validPokemon,
		total: pokemonList.count
	};
}
