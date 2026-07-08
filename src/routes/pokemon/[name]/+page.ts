import { error } from '@sveltejs/kit';
import { fetchPokemon, fetchPokemonSpecies, fetchEvolutionChain } from '$lib/api/client';
import { getPokemonId } from '$lib/utils/format';

export const prerender = false;

export async function load({ params }) {
	try {
		const pokemon = await fetchPokemon(params.name);

		let evolutionChain = null;
		try {
			const species = await fetchPokemonSpecies(pokemon.id);
			const chainId = getPokemonId(species.evolution_chain.url);
			evolutionChain = await fetchEvolutionChain(chainId);
		} catch {
			// Evolution chain is optional
		}

		return {
			pokemon,
			evolutionChain
		};
	} catch (err) {
		throw error(404, 'Pokémon not found');
	}
}
